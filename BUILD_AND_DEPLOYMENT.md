# Build and Deployment Guide

This document provides comprehensive instructions for building and deploying the CommerceSphere frontend application.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
- [Local Development](#local-development)
- [Building for Production](#building-for-production)
- [Docker Deployment](#docker-deployment)
- [Kubernetes Deployment](#kubernetes-deployment)
- [CI/CD Pipeline](#cicd-pipeline)
- [Performance Optimization](#performance-optimization)
- [Troubleshooting](#troubleshooting)

## Prerequisites

- Node.js 20.x or higher
- npm 9.x or higher
- Docker 24.x or higher (for containerized deployment)
- kubectl (for Kubernetes deployment)
- Access to Docker Hub or container registry

## Environment Configuration

### Environment Variables

The application uses different environment files for different deployment stages:

- `.env.development` - Local development
- `.env.staging` - Staging environment
- `.env.production` - Production environment

### Required Environment Variables

```bash
# API Configuration
VITE_API_GATEWAY_URL=https://api.commercesphere.com
VITE_WS_URL=wss://api.commercesphere.com

# App Configuration
VITE_APP_NAME=CommerceSphere
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=production

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_TRACKING=true

# External Services
VITE_STRIPE_PUBLIC_KEY=pk_live_...
VITE_GOOGLE_ANALYTICS_ID=UA-...
VITE_SENTRY_DSN=https://...@sentry.io/...

# Sentry (for source map upload)
SENTRY_ORG=your-org
SENTRY_PROJECT=your-project
SENTRY_AUTH_TOKEN=your-auth-token
```

## Local Development

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Development Features

- Hot Module Replacement (HMR)
- Fast Refresh for React components
- Source maps for debugging
- API proxy to backend services

## Building for Production

### Build Commands

```bash
# Build for development
npm run build:dev

# Build for staging
npm run build:staging

# Build for production
npm run build:production

# Build with bundle analysis
npm run build:analyze
```

### Build Output

The build process generates optimized assets in the `dist/` directory:

```
dist/
├── assets/
│   ├── js/
│   │   ├── react-vendor-[hash].js
│   │   ├── redux-vendor-[hash].js
│   │   ├── ui-vendor-[hash].js
│   │   └── [name]-[hash].js
│   ├── images/
│   │   └── [name]-[hash].[ext]
│   └── fonts/
│       └── [name]-[hash].[ext]
└── index.html
```

### Build Optimizations

The build process includes:

- **Code Splitting**: Automatic route-based and vendor chunking
- **Tree Shaking**: Removes unused code
- **Minification**: Terser for JavaScript, cssnano for CSS
- **Compression**: Gzip and Brotli compression ready
- **Source Maps**: Hidden source maps for production debugging
- **Asset Optimization**: Image and font optimization
- **Cache Busting**: Content-based hashing for optimal caching

### Bundle Analysis

To analyze bundle sizes and dependencies:

```bash
npm run build:analyze
```

This generates a visual report at `dist/stats.html`

## Docker Deployment

### Build Docker Image

```bash
# Build with default settings
docker build -t commercesphere-frontend:latest .

# Build with custom environment variables
docker build \
  --build-arg VITE_API_GATEWAY_URL=https://api.commercesphere.com \
  --build-arg VITE_WS_URL=wss://api.commercesphere.com \
  --build-arg VITE_APP_ENV=production \
  -t commercesphere-frontend:latest .
```

### Run Docker Container

```bash
# Run container
docker run -p 8080:8080 commercesphere-frontend:latest

# Run with docker-compose
docker-compose up -d
```

The application will be available at `http://localhost:8080`

### Docker Image Features

- **Multi-stage Build**: Optimized image size (~50MB)
- **Nginx Server**: High-performance static file serving
- **Security**: Non-root user, minimal attack surface
- **Health Checks**: Built-in health check endpoint
- **Compression**: Gzip compression enabled
- **Caching**: Optimal cache headers for static assets

## Kubernetes Deployment

### Prerequisites

- Kubernetes cluster (1.28+)
- kubectl configured
- Ingress controller (nginx)
- cert-manager for TLS certificates

### Deploy to Kubernetes

```bash
# Apply deployment configuration
kubectl apply -f kubernetes/deployment.yaml

# Check deployment status
kubectl rollout status deployment/frontend-deployment -n production

# View pods
kubectl get pods -n production -l app=frontend

# View service
kubectl get svc frontend-service -n production

# View ingress
kubectl get ingress frontend-ingress -n production
```

### Kubernetes Features

- **High Availability**: 3 replicas minimum
- **Auto-scaling**: HPA based on CPU and memory
- **Rolling Updates**: Zero-downtime deployments
- **Health Checks**: Liveness and readiness probes
- **Resource Limits**: CPU and memory constraints
- **TLS/SSL**: Automatic certificate management
- **Rate Limiting**: Protection against abuse

### Scaling

```bash
# Manual scaling
kubectl scale deployment/frontend-deployment --replicas=5 -n production

# Auto-scaling is configured via HPA:
# - Min replicas: 3
# - Max replicas: 10
# - CPU threshold: 70%
# - Memory threshold: 80%
```

## CI/CD Pipeline

### GitHub Actions Workflows

#### Frontend CI (`frontend-ci.yml`)

Triggered on:
- Push to `main`, `develop`, or `feature/**` branches
- Pull requests to `main` or `develop`

Steps:
1. Lint and type check
2. Build for all environments
3. Build Docker image
4. Security scan with Trivy
5. Lighthouse performance audit (PRs only)

#### Frontend CD (`frontend-cd.yml`)

Triggered on:
- Push to `main` branch
- Manual workflow dispatch

Steps:
1. Deploy to staging
2. Run smoke tests
3. Deploy to production (manual approval)
4. Create GitHub release

### Required GitHub Secrets

```bash
# Docker Hub
DOCKER_USERNAME
DOCKER_PASSWORD

# Kubernetes
KUBE_CONFIG_STAGING
KUBE_CONFIG_PRODUCTION

# Environment URLs
VITE_API_GATEWAY_URL_DEVELOPMENT
VITE_API_GATEWAY_URL_STAGING
VITE_API_GATEWAY_URL_PRODUCTION
VITE_WS_URL_DEVELOPMENT
VITE_WS_URL_STAGING
VITE_WS_URL_PRODUCTION

# Sentry
VITE_SENTRY_DSN
SENTRY_ORG
SENTRY_PROJECT
SENTRY_AUTH_TOKEN
```

### Deployment Strategies

#### Staging Deployment
- Automatic on push to `main`
- No approval required
- Smoke tests run automatically

#### Production Deployment
- Manual trigger via workflow dispatch
- Requires approval
- Smoke tests run automatically
- GitHub release created on success

## Performance Optimization

### Build-time Optimizations

1. **Code Splitting**
   - Route-based splitting with React.lazy
   - Vendor chunking for better caching
   - Dynamic imports for large dependencies

2. **Minification**
   - JavaScript: Terser with aggressive settings
   - CSS: cssnano with optimizations
   - HTML: html-minifier-terser

3. **Tree Shaking**
   - ES modules for optimal tree shaking
   - Side-effect-free packages marked
   - Unused code elimination

4. **Asset Optimization**
   - Image compression and optimization
   - Font subsetting and optimization
   - SVG optimization

### Runtime Optimizations

1. **Caching Strategy**
   - Static assets: 1 year cache
   - HTML: 1 hour cache with revalidation
   - API responses: RTK Query caching

2. **Compression**
   - Gzip compression enabled
   - Brotli compression ready
   - Pre-compressed assets

3. **CDN Integration**
   - Static assets served from CDN
   - Edge caching for global distribution
   - Cache invalidation on deployment

### Performance Monitoring

- **Web Vitals**: Tracked via Sentry
- **Lighthouse CI**: Automated performance audits
- **Bundle Analysis**: Regular bundle size monitoring
- **Real User Monitoring**: Sentry performance monitoring

## Troubleshooting

### Build Issues

#### TypeScript Errors

```bash
# Clear TypeScript cache
rm -rf node_modules/.cache

# Rebuild
npm run build
```

#### Out of Memory

```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

### Docker Issues

#### Build Fails

```bash
# Clear Docker cache
docker builder prune -a

# Rebuild without cache
docker build --no-cache -t commercesphere-frontend:latest .
```

#### Container Won't Start

```bash
# Check logs
docker logs <container-id>

# Check health
docker inspect <container-id> | grep Health
```

### Kubernetes Issues

#### Pods Not Starting

```bash
# Check pod status
kubectl describe pod <pod-name> -n production

# Check logs
kubectl logs <pod-name> -n production

# Check events
kubectl get events -n production --sort-by='.lastTimestamp'
```

#### Image Pull Errors

```bash
# Verify image exists
docker pull your-docker-username/commercesphere-frontend:latest

# Check image pull secrets
kubectl get secrets -n production
```

### Performance Issues

#### Slow Build Times

1. Clear caches: `npm run clean`
2. Update dependencies: `npm update`
3. Check for large dependencies: `npm run build:analyze`

#### Large Bundle Sizes

1. Run bundle analysis: `npm run build:analyze`
2. Review and optimize imports
3. Consider lazy loading for large components
4. Check for duplicate dependencies

## Best Practices

### Development

- Use environment-specific `.env` files
- Never commit sensitive credentials
- Run linting and type checking before commits
- Test builds locally before pushing

### Deployment

- Always deploy to staging first
- Run smoke tests after deployment
- Monitor error rates and performance
- Keep rollback plan ready

### Security

- Regularly update dependencies
- Scan Docker images for vulnerabilities
- Use non-root users in containers
- Enable security headers in nginx
- Rotate secrets regularly

## Support

For issues or questions:
- Check the [troubleshooting section](#troubleshooting)
- Review GitHub Actions logs
- Contact the DevOps team
- Create an issue in the repository
