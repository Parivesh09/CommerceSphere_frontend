#!/bin/bash

# Build script for CommerceSphere Frontend
# Usage: ./scripts/build.sh [environment] [options]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default values
ENVIRONMENT=${1:-production}
ANALYZE=${ANALYZE:-false}
CLEAN=${CLEAN:-true}

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

print_header() {
    echo ""
    echo "=================================="
    echo "$1"
    echo "=================================="
    echo ""
}

check_node_version() {
    print_info "Checking Node.js version..."
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 20 ]; then
        print_error "Node.js version 20 or higher is required. Current version: $(node -v)"
        exit 1
    fi
    print_info "Node.js version: $(node -v) ✓"
}

check_dependencies() {
    print_info "Checking dependencies..."
    if [ ! -d "node_modules" ]; then
        print_warning "node_modules not found. Installing dependencies..."
        npm ci
    else
        print_info "Dependencies found ✓"
    fi
}

clean_build() {
    if [ "$CLEAN" = true ]; then
        print_info "Cleaning previous build..."
        rm -rf dist
        rm -rf node_modules/.vite
        print_info "Clean complete ✓"
    fi
}

run_type_check() {
    print_info "Running type check..."
    npm run type-check
    print_info "Type check passed ✓"
}

run_lint() {
    print_info "Running linter..."
    npm run lint
    print_info "Lint check passed ✓"
}

build_app() {
    print_info "Building application for $ENVIRONMENT..."
    
    if [ "$ANALYZE" = true ]; then
        print_info "Bundle analysis enabled"
        ANALYZE=true npm run build:$ENVIRONMENT
    else
        npm run build:$ENVIRONMENT
    fi
    
    print_info "Build complete ✓"
}

check_bundle_sizes() {
    print_info "Checking bundle sizes..."
    
    # Check JavaScript bundles
    for file in dist/assets/js/*.js; do
        if [ -f "$file" ]; then
            size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file")
            size_kb=$((size / 1024))
            filename=$(basename "$file")
            
            if [ $size_kb -gt 500 ]; then
                print_warning "$filename: ${size_kb}KB (exceeds 500KB threshold)"
            else
                print_info "$filename: ${size_kb}KB ✓"
            fi
        fi
    done
}

generate_build_info() {
    print_info "Generating build information..."
    
    cat > dist/build-info.json <<EOF
{
  "environment": "$ENVIRONMENT",
  "buildTime": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "gitCommit": "$(git rev-parse HEAD 2>/dev/null || echo 'unknown')",
  "gitBranch": "$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo 'unknown')",
  "nodeVersion": "$(node -v)",
  "npmVersion": "$(npm -v)"
}
EOF
    
    print_info "Build info generated ✓"
}

print_summary() {
    print_header "Build Summary"
    
    echo "Environment: $ENVIRONMENT"
    echo "Build time: $(date)"
    echo "Output directory: dist/"
    
    if [ -d "dist" ]; then
        echo "Total size: $(du -sh dist | cut -f1)"
        echo ""
        echo "Asset breakdown:"
        echo "  JavaScript: $(du -sh dist/assets/js 2>/dev/null | cut -f1 || echo 'N/A')"
        echo "  Images: $(du -sh dist/assets/images 2>/dev/null | cut -f1 || echo 'N/A')"
        echo "  Fonts: $(du -sh dist/assets/fonts 2>/dev/null | cut -f1 || echo 'N/A')"
    fi
    
    echo ""
    print_info "Build completed successfully! 🎉"
}

# Main execution
main() {
    print_header "CommerceSphere Frontend Build"
    
    # Validate environment
    if [[ ! "$ENVIRONMENT" =~ ^(development|staging|production)$ ]]; then
        print_error "Invalid environment: $ENVIRONMENT"
        echo "Valid environments: development, staging, production"
        exit 1
    fi
    
    # Run build steps
    check_node_version
    check_dependencies
    clean_build
    run_type_check
    run_lint
    build_app
    check_bundle_sizes
    generate_build_info
    print_summary
}

# Run main function
main
