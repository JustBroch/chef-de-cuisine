# Chef de Cuisine - Architecture Documentation

## Overview

Chef de Cuisine uses a modern **single Application Load Balancer (ALB) with path-based routing** architecture. This design provides a unified endpoint while maintaining completely independent frontend and backend services.

## High-Level Architecture

```
                    Internet
                        │
                        ▼
               ┌─────────────────────┐
               │  Application Load   │
               │     Balancer       │
               │  (Single DNS Name)  │
               └─────────┬───────────┘
                        │
              ┌─────────┴─────────┐
              │   Path-Based      │
              │     Routing       │
              │                   │
    ┌─────────▼─────────┐        │
    │   Frontend        │        │
    │   Rules:          │        │
    │   /, /recipes,    │        │
    │   /login, etc.    │        │
    └─────────┬─────────┘        │
              │                  │
    ┌─────────▼─────────┐   ┌────▼──────────┐
    │  nginx Service    │   │ Flask Service │
    │  (ECS Fargate)    │   │ (ECS Fargate) │
    │                   │   │               │
    │ • React SPA       │   │ • REST API    │
    │ • Static Assets   │   │ • Database    │
    │ • 2-5 Instances   │   │ • 2-5 Instances│
    └───────────────────┘   └───────────────┘
                                    │
                            ┌───────▼───────┐
                            │ RDS PostgreSQL│
                            │   Database    │
                            └───────────────┘
```

## Routing Strategy

### Single DNS Endpoint Design

**DNS Name**: `http://<load-balancer-dns>`

**Path-Based Routing Rules:**

| Path Pattern | Target Service | Description |
|-------------|---------------|-------------|
| `/api/*` | Backend (Flask) | All API endpoints |
| `/*` (default) | Frontend (nginx) | All other routes |

### Frontend Routes (nginx Service)

**Routes Handled:**
```bash
GET /                    # Home page
GET /recipes             # Recipe browsing page
GET /login               # Authentication page
GET /register            # User registration
GET /profile             # User profile
GET /assets/*            # Static files (JS, CSS, images)
GET /favicon.ico         # Site favicon
```

**Server Response Headers:**
```
Server: nginx/1.27.5
Content-Type: text/html
```

**nginx Configuration:**
- Serves production React build from `/usr/share/nginx/html`
- Handles SPA routing (fallback to `index.html`)
- Caches static assets with proper headers
- Health check endpoint on `/`

### Backend Routes (Flask Service)

**Routes Handled:**
```bash
GET|POST /api/v1/auth/*        # Authentication endpoints
GET|POST /api/v1/recipes/*     # Recipe management
GET|POST /api/v1/favorites/*   # User favorites
GET|POST /api/v1/users/*       # User management
POST /api/v1/admin/*           # Admin functions
```

**Server Response Headers:**
```
Server: Werkzeug/2.3.6 Python/3.11.13
Content-Type: application/json
```

**Flask Configuration:**
- Serves JSON API responses
- Handles database operations
- JWT authentication middleware
- CORS configured for same-origin

## Service Independence

### ECS Fargate Services

**Frontend Service:**
- **Image**: nginx + React production build
- **Instances**: 2-5 (auto-scaling based on CPU)
- **Port**: 80 (nginx default)
- **Health Check**: `GET /` (returns 200 OK)
- **Resources**: 0.25 vCPU, 0.5 GB RAM

**Backend Service:**
- **Image**: Python Flask + SQLAlchemy
- **Instances**: 2-5 (auto-scaling based on CPU)
- **Port**: 5000 (Flask default)
- **Health Check**: `GET /` (returns JSON)
- **Resources**: 0.5 vCPU, 1 GB RAM

### Independent Scaling

**Auto Scaling Policies:**
- **Target**: 60% CPU utilization
- **Scale Out**: Add instance when CPU > 60% for 60 seconds
- **Scale In**: Remove instance when CPU < 60% for 120 seconds
- **Cooldown**: 60 seconds between scaling actions

**Scaling Triggers:**
- **Frontend**: High traffic to static content, React app
- **Backend**: High API usage, database queries, filtering operations

## ALB Configuration

### Target Groups

**Frontend Target Group:**
- **Protocol**: HTTP
- **Port**: 80
- **Health Check**: `GET /` every 30 seconds
- **Healthy Threshold**: 2 consecutive successes
- **Unhealthy Threshold**: 5 consecutive failures

**Backend Target Group:**
- **Protocol**: HTTP
- **Port**: 5000
- **Health Check**: `GET /` every 30 seconds
- **Healthy Threshold**: 2 consecutive successes
- **Unhealthy Threshold**: 5 consecutive failures

### Listener Rules

**Rule Priority 100 (High Priority):**
```terraform
condition {
  path_pattern {
    values = ["/api/*"]
  }
}
action {
  type = "forward"
  target_group_arn = "backend-target-group"
}
```

**Default Rule (Lower Priority):**
```terraform
action {
  type = "forward"
  target_group_arn = "frontend-target-group"
}
```

## Advantages of This Architecture

### 1. No CORS Issues
```javascript
// Frontend can call API without CORS
fetch('/api/v1/recipes')  // Same domain = no CORS
```

### 2. Cost Efficiency
- **Single ALB**: ~$16/month vs ~$32/month for two ALBs
- **Shared Infrastructure**: One DNS, one SSL certificate
- **Optimized Resource Usage**: Load balancer efficiency

### 3. Simplified Client Configuration
```javascript
// Single base URL for entire application
const API_BASE = '';  // No need for separate API URL
const response = await fetch('/api/v1/recipes');
```

### 4. Professional Pattern
Used by industry leaders:
- **Netflix**: Single domain with microservice routing
- **Airbnb**: API and web app on same domain
- **GitHub**: github.com serves both UI and API
- **Spotify**: Unified domain with path-based routing

### 5. Security Benefits
- **Single Attack Surface**: One endpoint to secure
- **Unified SSL**: One certificate for entire application
- **Consistent Security Headers**: Applied at ALB level

## Deployment Environments

### Local Development

**Frontend:**
- **URL**: `http://localhost:5173`
- **Server**: Vite development server
- **Features**: Hot reload, source maps

**Backend:**
- **URL**: `http://localhost:5174`
- **Server**: Flask development server
- **Features**: Debug mode, auto-reload

**API Calls:**
```javascript
// Frontend calls backend directly
const response = await fetch('http://localhost:5174/api/v1/recipes');
```

### Production (AWS)

**Single Endpoint:**
- **URL**: `http://<load-balancer-dns>`
- **Frontend**: `http://<load-balancer-dns>/`
- **Backend**: `http://<load-balancer-dns>/api/v1/*`

**API Calls:**
```javascript
// Frontend calls backend through ALB
const response = await fetch('/api/v1/recipes');
```

## Monitoring and Observability

### CloudWatch Metrics

**ALB Metrics:**
- Request count per target group
- Response time percentiles
- Error rates (4xx, 5xx)
- Target health status

**ECS Metrics:**
- CPU and memory utilization
- Task start/stop events
- Service scaling actions
- Container health checks

### Health Checks

**Frontend Health Check:**
```bash
curl -I http://<load-balancer-dns>/
# Expected: HTTP/1.1 200 OK, Server: nginx
```

**Backend Health Check:**
```bash
curl -I http://<load-balancer-dns>/api/v1/recipes
# Expected: HTTP/1.1 200 OK, Server: Werkzeug
```

## Troubleshooting

### Common Issues

**1. 404 Errors on Frontend Routes**
- **Cause**: nginx not configured for SPA routing
- **Solution**: Verify nginx fallback to `index.html`

**2. API Calls Failing**
- **Cause**: Path pattern not matching `/api/*`
- **Solution**: Check ALB listener rules configuration

**3. CORS Errors**
- **Cause**: Misconfigured API base URL
- **Solution**: Ensure API calls use relative paths

### Testing Service Independence

**Frontend Only:**
```bash
# Should return HTML
curl http://<load-balancer-dns>/recipes
```

**Backend Only:**
```bash
# Should return JSON
curl http://<load-balancer-dns>/api/v1/recipes
```

## Security Considerations

### Network Security
- **Security Groups**: Restrict ECS tasks to ALB traffic only
- **Private Subnets**: ECS tasks not directly accessible from internet
- **Database**: RDS in private subnet, accessible only from ECS

### Application Security
- **JWT Tokens**: Secure authentication with configurable expiration
- **Input Validation**: All API inputs validated and sanitized
- **SQL Injection Protection**: SQLAlchemy ORM prevents injection attacks

This architecture provides the perfect balance of simplicity, performance, and maintainability while following industry best practices. 