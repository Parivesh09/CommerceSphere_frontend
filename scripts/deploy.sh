#!/bin/bash

# Deployment script for CommerceSphere Frontend
# Usage: ./scripts/deploy.sh [environment]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
ENVIRONMENT=${1:-staging}
DOCKER_USERNAME=${DOCKER_USERNAME:-""}
IMAGE_TAG=${IMAGE_TAG:-latest}

# Functions
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

print_header() {
    echo ""
    echo "=================================="
    echo "$1"
    echo "=================================="
    echo ""
}

check_prerequisites() {
    print_step "Checking prerequisites..."
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed"
        exit 1
    fi
    print_info "Docker: $(docker --version) ✓"
    
    # Check kubectl
    if ! command -v kubectl &> /dev/null; then
        print_error "kubectl is not installed"
        exit 1
    fi
    print_info "kubectl: $(kubectl version --client --short 2>/dev/null || kubectl version --client) ✓"
    
    # Check Docker username
    if [ -z "$DOCKER_USERNAME" ]; then
        print_error "DOCKER_USERNAME environment variable is not set"
        exit 1
    fi
    print_info "Docker username: $DOCKER_USERNAME ✓"
}

load_env_file() {
    print_step "Loading environment configuration..."
    
    ENV_FILE=".env.$ENVIRONMENT"
    if [ ! -f "$ENV_FILE" ]; then
        print_error "Environment file not found: $ENV_FILE"
        exit 1
    fi
    
    # Export variables from env file
    set -a
    source "$ENV_FILE"
    set +a
    
    print_info "Environment loaded: $ENVIRONMENT ✓"
}

build_docker_image() {
    print_step "Building Docker image..."
    
    IMAGE_NAME="$DOCKER_USERNAME/commercesphere-frontend:$IMAGE_TAG"
    
    docker build \
        --build-arg VITE_API_GATEWAY_URL="$VITE_API_GATEWAY_URL" \
        --build-arg VITE_WS_URL="$VITE_WS_URL" \
        --build-arg VITE_APP_NAME="$VITE_APP_NAME" \
        --build-arg VITE_APP_VERSION="$VITE_APP_VERSION" \
        --build-arg VITE_APP_ENV="$VITE_APP_ENV" \
        --build-arg VITE_ENABLE_ANALYTICS="$VITE_ENABLE_ANALYTICS" \
        --build-arg VITE_ENABLE_ERROR_TRACKING="$VITE_ENABLE_ERROR_TRACKING" \
        --build-arg VITE_STRIPE_PUBLIC_KEY="$VITE_STRIPE_PUBLIC_KEY" \
        --build-arg VITE_GOOGLE_ANALYTICS_ID="$VITE_GOOGLE_ANALYTICS_ID" \
        --build-arg VITE_SENTRY_DSN="$VITE_SENTRY_DSN" \
        -t "$IMAGE_NAME" \
        .
    
    print_info "Docker image built: $IMAGE_NAME ✓"
}

push_docker_image() {
    print_step "Pushing Docker image..."
    
    IMAGE_NAME="$DOCKER_USERNAME/commercesphere-frontend:$IMAGE_TAG"
    
    docker push "$IMAGE_NAME"
    
    print_info "Docker image pushed: $IMAGE_NAME ✓"
}

deploy_to_kubernetes() {
    print_step "Deploying to Kubernetes ($ENVIRONMENT)..."
    
    NAMESPACE=$ENVIRONMENT
    IMAGE_NAME="$DOCKER_USERNAME/commercesphere-frontend:$IMAGE_TAG"
    
    # Check if namespace exists
    if ! kubectl get namespace "$NAMESPACE" &> /dev/null; then
        print_warning "Namespace $NAMESPACE does not exist. Creating..."
        kubectl create namespace "$NAMESPACE"
    fi
    
    # Update deployment image
    kubectl set image deployment/frontend-deployment \
        frontend="$IMAGE_NAME" \
        --namespace="$NAMESPACE" \
        --record
    
    print_info "Deployment updated ✓"
    
    # Wait for rollout
    print_info "Waiting for rollout to complete..."
    kubectl rollout status deployment/frontend-deployment \
        --namespace="$NAMESPACE" \
        --timeout=10m
    
    print_info "Rollout complete ✓"
}

run_smoke_tests() {
    print_step "Running smoke tests..."
    
    # Determine URL based on environment
    case $ENVIRONMENT in
        development)
            URL="http://localhost:8080"
            ;;
        staging)
            URL="https://staging.commercesphere.com"
            ;;
        production)
            URL="https://commercesphere.com"
            ;;
        *)
            print_warning "Unknown environment, skipping smoke tests"
            return
            ;;
    esac
    
    # Health check
    print_info "Checking health endpoint..."
    if curl -f "$URL/health" &> /dev/null; then
        print_info "Health check passed ✓"
    else
        print_error "Health check failed"
        exit 1
    fi
    
    # Homepage check
    print_info "Checking homepage..."
    if curl -f "$URL" &> /dev/null; then
        print_info "Homepage check passed ✓"
    else
        print_error "Homepage check failed"
        exit 1
    fi
    
    print_info "Smoke tests passed ✓"
}

rollback_deployment() {
    print_warning "Rolling back deployment..."
    
    NAMESPACE=$ENVIRONMENT
    
    kubectl rollout undo deployment/frontend-deployment \
        --namespace="$NAMESPACE"
    
    kubectl rollout status deployment/frontend-deployment \
        --namespace="$NAMESPACE" \
        --timeout=10m
    
    print_info "Rollback complete ✓"
}

print_summary() {
    print_header "Deployment Summary"
    
    echo "Environment: $ENVIRONMENT"
    echo "Image: $DOCKER_USERNAME/commercesphere-frontend:$IMAGE_TAG"
    echo "Deployment time: $(date)"
    
    case $ENVIRONMENT in
        development)
            echo "URL: http://localhost:8080"
            ;;
        staging)
            echo "URL: https://staging.commercesphere.com"
            ;;
        production)
            echo "URL: https://commercesphere.com"
            ;;
    esac
    
    echo ""
    print_info "Deployment completed successfully! 🚀"
}

# Main execution
main() {
    print_header "CommerceSphere Frontend Deployment"
    
    # Validate environment
    if [[ ! "$ENVIRONMENT" =~ ^(development|staging|production)$ ]]; then
        print_error "Invalid environment: $ENVIRONMENT"
        echo "Valid environments: development, staging, production"
        exit 1
    fi
    
    # Confirm production deployment
    if [ "$ENVIRONMENT" = "production" ]; then
        print_warning "You are about to deploy to PRODUCTION!"
        read -p "Are you sure you want to continue? (yes/no): " confirm
        if [ "$confirm" != "yes" ]; then
            print_info "Deployment cancelled"
            exit 0
        fi
    fi
    
    # Run deployment steps
    check_prerequisites
    load_env_file
    build_docker_image
    push_docker_image
    deploy_to_kubernetes
    run_smoke_tests
    print_summary
}

# Trap errors and rollback
trap 'print_error "Deployment failed!"; rollback_deployment; exit 1' ERR

# Run main function
main
