#########################
# Terraform & Providers
#########################

terraform {
  required_version = ">= 1.3.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.5"
    }
    null = {
      source  = "hashicorp/null"
      version = "~> 3.2.1"
    }
  }
}

#########################
# Input Variables
#########################

variable "aws_region" {
  description = "AWS region to deploy resources in"
  type        = string
  default     = "us-east-1"
}

variable "credentials_file" {
  description = "Relative path to AWS shared credentials file inside repo root"
  type        = string
  default     = "credentials"
}

variable "aws_profile" {
  description = "AWS credentials profile name. Leave empty to use default profile/environment creds."
  type        = string
  default     = ""
}

variable "project_name" {
  description = "Project namespace prefix for resource names"
  type        = string
  default     = "chefdeCuisine"
}

variable "ecr_repository_name" {
  description = "Name of the existing ECR repository containing the application image"
  type        = string
  default     = "chefde-cuisine-backend"
}

variable "ecr_image_tag" {
  description = "Docker image tag to deploy"
  type        = string
  default     = "latest"
}

variable "db_username" {
  description = "Master username for the Postgres database"
  type        = string
  default     = "postgres"
}

variable "db_password" {
  description = "Master password for the Postgres database (leave blank to auto-generate)"
  type        = string
  sensitive   = true
  default     = ""
}

variable "desired_count" {
  description = "Desired number of ECS tasks to run"
  type        = number
  default     = 2
}

variable "min_capacity" {
  description = "Minimum capacity for ECS service auto scaling"
  type        = number
  default     = 2
}

variable "max_capacity" {
  description = "Maximum capacity for ECS service auto scaling"
  type        = number
  default     = 5
}

#########################
# Local Values
#########################

locals {
  # Extract the first profile name from credentials file
  credentials_content = file("${path.module}/${var.credentials_file}")
  aws_profile_from_file = regex("\\[([^\\]]+)\\]", local.credentials_content)[0]
  effective_aws_profile = var.aws_profile != "" ? var.aws_profile : local.aws_profile_from_file
}

#########################
# AWS Provider
#########################

provider "aws" {
  region                   = var.aws_region
  shared_credentials_files = [abspath("${path.module}/${var.credentials_file}")]
  profile                  = local.effective_aws_profile
}

#########################
# Outputs
#########################

output "load_balancer_dns" {
  description = "DNS name of the Application Load Balancer"
  value       = aws_lb.app.dns_name
}

output "ecr_repository_url" {
  description = "URL of the ECR repository"
  value       = aws_ecr_repository.app.repository_url
}

#########################
# Data Sources
#########################

data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

#########################
# CloudWatch Log Group
#########################
resource "aws_cloudwatch_log_group" "app" {
  name              = "/ecs/${var.project_name}"
  retention_in_days = 14
}

#########################
# ECR Repository
#########################
resource "aws_ecr_repository" "app" {
  name = var.ecr_repository_name
}

#########################
# IAM Roles - Use existing/managed roles
#########################

# Get current AWS caller identity to determine the role being used
data "aws_caller_identity" "current" {}

# Use the current assumed role for both execution and task roles
# This works in lab environments where the same role has necessary permissions
data "aws_iam_role" "ecs_execution" {
  name = "LabRole"
}

data "aws_iam_role" "ecs_task" {
  name = "LabRole"
}

#########################
# Security Groups
#########################

resource "aws_security_group" "alb" {
  name        = "${var.project_name}-alb-sg"
  description = "Allow HTTP/HTTPS inbound"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "ecs_service" {
  name        = "${var.project_name}-ecs-sg"
  description = "Allow traffic from ALB"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description     = "App traffic from ALB"
    from_port       = 5000
    to_port         = 5000
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "rds" {
  name        = "${var.project_name}-rds-sg"
  description = "Allow Postgres access from ECS"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description     = "Postgres"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.ecs_service.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

#########################
# RDS - PostgreSQL
#########################
resource "aws_db_subnet_group" "db" {
  name       = "${lower(var.project_name)}-db-subnets"
  subnet_ids = data.aws_subnets.default.ids
}

resource "random_password" "db" {
  length           = 16
  special          = true
  override_special = "!@#%&*"
}

resource "aws_db_instance" "postgres" {
  identifier              = "${lower(var.project_name)}-postgres"
  engine                  = "postgres"
  instance_class          = "db.t3.micro"
  allocated_storage       = 20
  db_subnet_group_name    = aws_db_subnet_group.db.name
  vpc_security_group_ids  = [aws_security_group.rds.id]
  username                = var.db_username
  password                = coalesce(var.db_password, random_password.db.result)
  skip_final_snapshot     = true
  publicly_accessible     = false
}

#########################
# ECS Cluster & Task Definition
#########################
resource "aws_ecs_cluster" "app" {
  name = "${var.project_name}-cluster"
}

locals {
  container_name = "${var.project_name}-backend"
  image_url      = "${aws_ecr_repository.app.repository_url}:${var.ecr_image_tag}"
}

resource "aws_ecs_task_definition" "app" {
  family                   = "${var.project_name}-taskdef"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = data.aws_iam_role.ecs_execution.arn
  task_role_arn            = data.aws_iam_role.ecs_task.arn

  container_definitions = jsonencode([
    {
      name      = local.container_name,
      image     = local.image_url,
      essential = true,
      portMappings = [
        {
          containerPort = 5000,
          hostPort      = 5000,
          protocol      = "tcp"
        }
      ],
      environment = [
        { name = "DB_HOST", value = aws_db_instance.postgres.address },
        { name = "DB_USER", value = var.db_username },
        { name = "DB_PASSWORD", value = coalesce(var.db_password, random_password.db.result) },
        { name = "DB_NAME", value = "postgres" }
      ],
      logConfiguration = {
        logDriver = "awslogs",
        options = {
          awslogs-group         = aws_cloudwatch_log_group.app.name,
          awslogs-region        = var.aws_region,
          awslogs-stream-prefix = "ecs"
        }
      }
    }
  ])
}

#########################
# Load Balancer (ALB)
#########################
resource "aws_lb" "app" {
  name               = "${var.project_name}-alb"
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = data.aws_subnets.default.ids
}

resource "aws_lb_target_group" "app" {
  name        = "${var.project_name}-tg"
  port        = 5000
  protocol    = "HTTP"
  vpc_id      = data.aws_vpc.default.id
  target_type = "ip"

  health_check {
    path                = "/"
    protocol            = "HTTP"
    matcher             = "200-399"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 3
    unhealthy_threshold = 3
  }
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.app.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app.arn
  }
}

#########################
# ECS Service
#########################
resource "aws_ecs_service" "app" {
  name            = "${var.project_name}-service"
  cluster         = aws_ecs_cluster.app.id
  task_definition = aws_ecs_task_definition.app.arn
  desired_count   = var.desired_count
  launch_type     = "FARGATE"

  network_configuration {
    assign_public_ip = true
    subnets         = data.aws_subnets.default.ids
    security_groups = [aws_security_group.ecs_service.id]
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.app.arn
    container_name   = local.container_name
    container_port   = 5000
  }

  lifecycle {
    ignore_changes = [task_definition]
  }
}

#########################
# Auto Scaling
#########################
resource "aws_appautoscaling_target" "ecs" {
  service_namespace  = "ecs"
  resource_id        = "service/${aws_ecs_cluster.app.name}/${aws_ecs_service.app.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  min_capacity       = var.min_capacity
  max_capacity       = var.max_capacity
}

resource "aws_appautoscaling_policy" "cpu_scale_out" {
  name               = "${var.project_name}-cpu-scale-out"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.ecs.resource_id
  scalable_dimension = aws_appautoscaling_target.ecs.scalable_dimension
  service_namespace  = aws_appautoscaling_target.ecs.service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
    target_value       = 60
    scale_out_cooldown = 60
    scale_in_cooldown  = 120
  }
}

#########################
# Docker Build and Push
#########################

resource "null_resource" "docker_build_push" {
  depends_on = [aws_ecr_repository.app]

  provisioner "local-exec" {
    command = <<-EOT
      # ECR Login with explicit credentials file and profile
      AWS_SHARED_CREDENTIALS_FILE=${abspath("${path.module}/${var.credentials_file}")} aws ecr get-login-password --region ${var.aws_region} --profile ${local.effective_aws_profile} | docker login --username AWS --password-stdin ${aws_ecr_repository.app.repository_url}
      
      # Build and push Docker image
      cd backend && \
      docker build --platform linux/amd64 -t ${var.ecr_repository_name} . && \
      docker tag ${var.ecr_repository_name}:latest ${aws_ecr_repository.app.repository_url}:latest && \
      docker push ${aws_ecr_repository.app.repository_url}:latest
    EOT
  }

  triggers = {
    # Trigger on source code changes
    source_hash = filemd5("${path.module}/backend/app.py")
    requirements_hash = filemd5("${path.module}/backend/requirements.txt")
    dockerfile_hash = filemd5("${path.module}/backend/Dockerfile")
    # Trigger on every deployment
    always_rebuild = timestamp()
  }
}

# Force ECS service redeployment when Docker image changes
resource "null_resource" "force_ecs_deployment" {
  depends_on = [null_resource.docker_build_push, aws_ecs_service.app]

  provisioner "local-exec" {
    command = "AWS_SHARED_CREDENTIALS_FILE=${abspath("${path.module}/${var.credentials_file}")} aws ecs update-service --region ${var.aws_region} --profile ${local.effective_aws_profile} --cluster ${aws_ecs_cluster.app.name} --service ${aws_ecs_service.app.name} --force-new-deployment"
  }

  triggers = {
    # Trigger when Docker image changes
    docker_image_id = null_resource.docker_build_push.id
  }
} 