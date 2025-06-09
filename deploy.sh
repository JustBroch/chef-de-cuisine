#!/usr/bin/env bash
set -euo pipefail

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Container and image names
DB_CONTAINER="chefdecuisine-db"
BACKEND_CONTAINER="chefdecuisine-backend"
BACKEND_IMAGE="chefdecuisine-backend:local"
FRONTEND_IMAGE="chefdecuisine-frontend:local"
POSTGRES_IMAGE="postgres:15-alpine"

# Ports
DB_PORT=5432
BACKEND_PORT=5174
FRONTEND_PORT=5173

# Database configuration
DB_NAME="chefdecuisine"
DB_USER="chef"
DB_PASSWORD="cuisine123"

echo -e "${GREEN}Chef de Cuisine Deployment Manager${NC}"

# Function to check if Docker is running
check_docker() {
    if ! docker info >/dev/null 2>&1; then
        echo -e "${RED}Docker is not running. Please start Docker and try again.${NC}"
        exit 1
    fi
}

# Function to check if Terraform is installed
check_terraform() {
    if ! command -v terraform &> /dev/null; then
        echo -e "${RED}Terraform is not installed. Please install Terraform and try again.${NC}"
        exit 1
    fi
}

# Function to clear ports (kill processes using the ports)
clear_ports() {
    echo -e "${YELLOW}Clearing ports...${NC}"
    
    # Kill processes on backend port
    if lsof -ti:${BACKEND_PORT} >/dev/null 2>&1; then
        echo -e "${YELLOW}   Killing process on port ${BACKEND_PORT}...${NC}"
        lsof -ti:${BACKEND_PORT} | xargs kill -9 2>/dev/null || true
        sleep 1
    fi
    
    # Kill processes on frontend port  
    if lsof -ti:${FRONTEND_PORT} >/dev/null 2>&1; then
        echo -e "${YELLOW}   Killing process on port ${FRONTEND_PORT}...${NC}"
        lsof -ti:${FRONTEND_PORT} | xargs kill -9 2>/dev/null || true
        sleep 1
    fi
    
    # Kill processes on database port
    if lsof -ti:${DB_PORT} >/dev/null 2>&1; then
        echo -e "${YELLOW}   Killing process on port ${DB_PORT}...${NC}"
        lsof -ti:${DB_PORT} | xargs kill -9 2>/dev/null || true
        sleep 1
    fi
    
    echo -e "${GREEN}Ports cleared${NC}"
}

# Function to build everything
build() {
    echo -e "${YELLOW}Building Chef de Cuisine locally...${NC}"
    
    check_docker
    
    # Pull PostgreSQL image
    echo -e "${YELLOW}Pulling PostgreSQL image...${NC}"
    docker pull ${POSTGRES_IMAGE} >/dev/null 2>&1
    
    # Build backend Docker image
    echo -e "${YELLOW}Building backend image...${NC}"
    cd backend
    docker build -t ${BACKEND_IMAGE} . -q
    cd ..
    
    # Build frontend Docker image (for cloud deployment)
    echo -e "${YELLOW}Building frontend image...${NC}"
    docker build -f Dockerfile.frontend -t ${FRONTEND_IMAGE} . -q
    
    # Install frontend dependencies (for local development)
    echo -e "${YELLOW}Installing frontend dependencies...${NC}"
    npm install --silent
    
    echo -e "${GREEN}Build complete!${NC}"
    echo -e "${GREEN}   - PostgreSQL image: ${POSTGRES_IMAGE}${NC}"
    echo -e "${GREEN}   - Backend image: ${BACKEND_IMAGE}${NC}"
    echo -e "${GREEN}   - Frontend image: ${FRONTEND_IMAGE}${NC}"
    echo -e "${GREEN}   - Frontend dependencies: installed${NC}"
}

# Function to start services locally
start() {
    echo -e "${YELLOW}Starting Chef de Cuisine services locally...${NC}"
    
    check_docker
    clear_ports
    
    # Check if backend image exists
    if ! docker image inspect ${BACKEND_IMAGE} >/dev/null 2>&1; then
        echo -e "${YELLOW}Backend image not found, building...${NC}"
        build
    fi
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}Frontend dependencies not found, installing...${NC}"
        npm install --silent
    fi
    
    # Stop and remove containers if they exist
    echo -e "${YELLOW}Cleaning up existing containers...${NC}"
    docker stop ${DB_CONTAINER} ${BACKEND_CONTAINER} 2>/dev/null || true
    docker rm ${DB_CONTAINER} ${BACKEND_CONTAINER} 2>/dev/null || true
    
    # Start containers in background first
    echo -e "${YELLOW}Starting database...${NC}"
    docker run -d \
        --name ${DB_CONTAINER} \
        -e POSTGRES_DB=${DB_NAME} \
        -e POSTGRES_USER=${DB_USER} \
        -e POSTGRES_PASSWORD=${DB_PASSWORD} \
        -p ${DB_PORT}:5432 \
        ${POSTGRES_IMAGE} >/dev/null 2>&1
    
    # Wait for database
    echo -e "${YELLOW}Waiting for database...${NC}"
    sleep 5
    
    echo -e "${YELLOW}Starting backend API...${NC}"
    docker run -d \
        --name ${BACKEND_CONTAINER} \
        -p ${BACKEND_PORT}:5000 \
        -e DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@host.docker.internal:${DB_PORT}/${DB_NAME} \
        ${BACKEND_IMAGE} >/dev/null 2>&1
    
    # Wait for backend
    echo -e "${YELLOW}Waiting for backend...${NC}"
    sleep 3
    
    echo -e "${GREEN}Services started!${NC}"
    echo -e "${GREEN}   - Database: postgresql://localhost:${DB_PORT}${NC}"
    echo -e "${GREEN}   - Backend API: http://localhost:${BACKEND_PORT}${NC}"
    
    echo -e "${YELLOW}Starting frontend...${NC}"
    exec npm run dev
}

# Function to stop services
stop() {
    echo -e "${YELLOW}Stopping Chef de Cuisine services...${NC}"
    
    clear_ports
    
    # Stop containers
    docker stop ${DB_CONTAINER} ${BACKEND_CONTAINER} 2>/dev/null || true
    docker rm ${DB_CONTAINER} ${BACKEND_CONTAINER} 2>/dev/null || true
    
    echo -e "${GREEN}Services stopped${NC}"
    echo "Build artifacts preserved for quick restart"
}

# Function to clean everything
clean() {
    echo -e "${YELLOW}Cleaning Chef de Cuisine...${NC}"
    
    # Stop all services first
    stop >/dev/null 2>&1
    
    # Remove Docker images
    docker rmi ${BACKEND_IMAGE} ${FRONTEND_IMAGE} ${POSTGRES_IMAGE} 2>/dev/null || true
    
    # Remove frontend dependencies
    if [ -d "node_modules" ]; then
        echo -e "${YELLOW}Removing node_modules...${NC}"
        rm -rf node_modules
    fi
    
    if [ -f "package-lock.json" ]; then
        echo -e "${YELLOW}Removing package-lock.json...${NC}"
        rm -f package-lock.json
    fi
    
    echo -e "${GREEN}Cleanup complete!${NC}"
    echo "All images and dependencies removed"
}

# Function to show status
status() {
    echo -e "${GREEN}Service Status:${NC}"
    
    # Check database container
    if docker ps | grep -q ${DB_CONTAINER}; then
        echo -e "  Database: ${GREEN}Running${NC}"
    else
        echo -e "  Database: ${RED}Stopped${NC}"
    fi
    
    # Check backend container
    if docker ps | grep -q ${BACKEND_CONTAINER}; then
        echo -e "  Backend: ${GREEN}Running${NC}"
    else
        echo -e "  Backend: ${RED}Stopped${NC}"
    fi
    
    # Check frontend process
    if lsof -ti:${FRONTEND_PORT} >/dev/null 2>&1; then
        echo -e "  Frontend: ${GREEN}Running${NC}"
    else
        echo -e "  Frontend: ${RED}Stopped${NC}"
    fi
    
    echo -e "${GREEN}Service URLs:${NC}"
    echo -e "  Database: postgresql://localhost:${DB_PORT}"
    echo -e "  Backend: http://localhost:${BACKEND_PORT}"
    echo -e "  Frontend: http://localhost:${FRONTEND_PORT}"
    
    echo -e "${GREEN}Images:${NC}"
    if docker image inspect ${POSTGRES_IMAGE} >/dev/null 2>&1; then
        echo -e "  PostgreSQL: ${GREEN}Available${NC}"
    else
        echo -e "  PostgreSQL: ${RED}Missing${NC}"
    fi
    
    if docker image inspect ${BACKEND_IMAGE} >/dev/null 2>&1; then
        echo -e "  Backend: ${GREEN}Available${NC}"
    else
        echo -e "  Backend: ${RED}Missing${NC}"
    fi
    
    if docker image inspect ${FRONTEND_IMAGE} >/dev/null 2>&1; then
        echo -e "  Frontend: ${GREEN}Available${NC}"
    else
        echo -e "  Frontend: ${RED}Missing${NC}"
    fi
    
    if [ -d "node_modules" ]; then
        echo -e "  Frontend deps: ${GREEN}Available${NC}"
    else
        echo -e "  Frontend deps: ${RED}Missing${NC}"
    fi
}

# Function to deploy to AWS cloud
cloud() {
    echo -e "${BLUE}Deploying Chef de Cuisine to AWS...${NC}"
    
    check_terraform
    
    echo -e "${YELLOW}Initializing Terraform...${NC}"
    terraform init -upgrade
    
    echo -e "${YELLOW}Planning deployment...${NC}"
    terraform plan
    
    echo -e "${YELLOW}Applying Terraform configuration...${NC}"
    terraform apply -auto-approve
    
    echo -e "${YELLOW}Retrieving deployment information...${NC}"
    LB_DNS=$(terraform output -raw load_balancer_dns)
    
    echo -e "${GREEN}AWS Deployment complete!${NC}"
    echo -e "${GREEN}Application URL: http://${LB_DNS}${NC}"
    
    echo -e "${BLUE}Deployment Details:${NC}"
    echo "  - Load Balancer: ${LB_DNS}"
    echo "  - Backend: ECS Fargate service"
    echo "  - Database: RDS PostgreSQL"
    echo "  - Infrastructure: AWS (us-east-1)"
    echo "  - Deployment: $(date)"
    
    echo -e "${YELLOW}Note: Services may take 2-3 minutes to be fully available${NC}"
}

# Main script logic
case "${1:-help}" in
    "build")
        build
        ;;
    "start")
        start
        ;;
    "stop")
        stop
        ;;
    "clean")
        clean
        ;;
    "status")
        status
        ;;
    "cloud")
        cloud
        ;;
    "help"|*)
        echo -e "${GREEN}Chef de Cuisine Deployment Commands:${NC}"
        echo ""
        echo -e "${YELLOW}Local Development:${NC}"
        echo "  ./deploy.sh build     - Install dependencies and build images (no start)"
        echo "  ./deploy.sh start     - Clear ports, build if needed, and start all services"
        echo "  ./deploy.sh stop      - Stop all services (preserve build artifacts)"
        echo "  ./deploy.sh clean     - Remove all images and dependencies"
        echo ""
        echo -e "${YELLOW}Cloud Deployment:${NC}"
        echo "  ./deploy.sh cloud     - Deploy to AWS using Terraform"
        echo ""
        echo -e "${YELLOW}Monitoring:${NC}"
        echo "  ./deploy.sh status    - Show local service status and URLs"
        echo "  ./deploy.sh help      - Show this help message"
        echo ""
        echo -e "${YELLOW}Quick Start (Local):${NC}"
        echo "  ./deploy.sh build     # Build everything first"
        echo "  ./deploy.sh start     # Start services (frontend runs in foreground)"
        echo ""
        echo -e "${YELLOW}Development Workflow:${NC}"
        echo "  ./deploy.sh stop      # Stop services when done"
        echo "  ./deploy.sh start     # Restart quickly (no rebuild needed)"
        echo "  ./deploy.sh clean     # Clean slate for fresh start"
        echo ""
        echo -e "${YELLOW}Cloud Deployment:${NC}"
        echo "  ./deploy.sh cloud     # Deploy to AWS production"
        echo ""
        echo -e "${YELLOW}Prerequisites:${NC}"
        echo "  - Docker installed and running (for local)"
        echo "  - Node.js 18+ and npm installed (for local)"
        echo "  - Terraform installed (for cloud)"
        echo "  - AWS credentials configured (for cloud)"
        ;;
esac 