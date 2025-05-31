#!/usr/bin/env bash
set -euo pipefail

terraform init -input=false
terraform apply -auto-approve -input=false

# After apply, retrieve the load balancer DNS name from Terraform output
LB_DNS=$(terraform output -raw load_balancer_dns)

echo -e "\nDeployment complete. Load balancer DNS: $LB_DNS" 