# Build and Deployment Scripts

This directory contains scripts for building and deploying the CommerceSphere frontend application.

## Scripts

### build.sh

Builds the application for a specific environment with comprehensive checks and optimizations.

**Usage:**
```bash
./scripts/build.sh [environment] [options]
```

**Arguments:**
- `environment` - Target environment (development, staging, production). Default: production

**Environment Variables:**
- `ANALYZE` - Enable bundle analysis (true/false). Default: false
- `CLEAN` - Clean previous build (true/false). Default: true

**Examples:**
```bash
# Build for production
./scripts/build.sh production

# Build for staging
./scripts/build.sh staging

# Build with bundle analysis
ANALYZE=true ./scripts/build.sh production

# Build without cleaning
CLEAN=false ./scripts/build.sh development
```

**Features:**
- Node.js version check
- Dependency verification
- TypeScript type checking
- ESLint validation
- Bundle size analysis
- Build information generation
- Comprehensive summary

### deploy.sh

Deploys the application to Kubernetes with Docker image building and smoke tests.

**Usage:**
```bash
./scripts/deploy.sh [environment]
```

**Arguments:**
- `environment` - Target environment (development, staging, production). Default: staging

**Environment Variables:**
- `DOCKER_USERNAME` - Docker Hub username (required)
- `IMAGE_TAG` - Docker image tag. Default: latest

**Examples:**
```bash
# Deploy to staging
DOCKER_USERNAME=myusername ./scripts/deploy.sh staging

# Deploy to production with custom tag
DOCKER_USERNAME=myusername IMAGE_TAG=v1.2.3 ./scripts/deploy.sh production

# Deploy to development
DOCKER_USERNAME=myusername ./scripts/deploy.sh development
```

**Features:**
- Prerequisites checking (Docker, kubectl)
- Environment configuration loading
- Docker image building and pushing
- Kubernetes deployment
- Rollout status monitoring
- Smoke tests
- Automatic rollback on failure
- Production deployment confirmation

## Prerequisites

### For build.sh
- Node.js 20.x or higher
- npm 9.x or higher

### For deploy.sh
- Docker 24.x or higher
- kubectl configured with cluster access
- Docker Hub credentials
- Kubernetes cluster access

## Environment Files

Ensure you have the appropriate environment files:
- `.env.development`
- `.env.staging`
- `.env.production`

## Workflow

### Local Development Build
```bash
# Install dependencies
npm install

# Build for development
./scripts/build.sh development

# Preview build
npm run preview
```

### Staging Deployment
```bash
# Build and deploy to staging
DOCKER_USERNAME=myusername ./scripts/deploy.sh staging
```

### Production Deployment
```bash
# Build with analysis
ANALYZE=true ./scripts/build.sh production

# Review bundle sizes
open dist/stats.html

# Deploy to production (requires confirmation)
DOCKER_USERNAME=myusername ./scripts/deploy.sh production
```

## Troubleshooting

### Build Script Issues

**Node.js version error:**
```bash
# Check Node.js version
node -v

# Install correct version using nvm
nvm install 20
nvm use 20
```

**Type check failures:**
```bash
# Run type check separately
npm run type-check

# Fix type errors and rebuild
```

**Lint failures:**
```bash
# Run lint with auto-fix
npm run lint:fix

# Review and fix remaining issues
```

### Deploy Script Issues

**Docker not found:**
```bash
# Install Docker
# Visit: https://docs.docker.com/get-docker/
```

**kubectl not found:**
```bash
# Install kubectl
# Visit: https://kubernetes.io/docs/tasks/tools/
```

**Authentication errors:**
```bash
# Login to Docker Hub
docker login

# Verify kubectl access
kubectl cluster-info
```

**Deployment failures:**
```bash
# Check pod status
kubectl get pods -n [environment]

# View pod logs
kubectl logs [pod-name] -n [environment]

# Manual rollback if needed
kubectl rollout undo deployment/frontend-deployment -n [environment]
```

## Best Practices

1. **Always test locally first:**
   ```bash
   npm run dev
   npm run build
   npm run preview
   ```

2. **Run analysis before production:**
   ```bash
   ANALYZE=true ./scripts/build.sh production
   ```

3. **Deploy to staging before production:**
   ```bash
   ./scripts/deploy.sh staging
   # Test thoroughly
   ./scripts/deploy.sh production
   ```

4. **Monitor deployments:**
   ```bash
   # Watch rollout
   kubectl rollout status deployment/frontend-deployment -n production
   
   # Monitor pods
   kubectl get pods -n production -w
   ```

5. **Keep environment files secure:**
   - Never commit `.env` files with secrets
   - Use secret management tools for production
   - Rotate credentials regularly

## CI/CD Integration

These scripts are designed to work with CI/CD pipelines but can also be run manually.

**GitHub Actions:**
- `frontend-ci.yml` - Automated builds and tests
- `frontend-cd.yml` - Automated deployments

**Manual deployment from CI/CD:**
```bash
# Trigger deployment workflow
gh workflow run frontend-cd.yml -f environment=production
```

## Support

For issues or questions:
- Check the main [BUILD_AND_DEPLOYMENT.md](../BUILD_AND_DEPLOYMENT.md)
- Review script output for error messages
- Check Kubernetes logs
- Contact DevOps team
