# Chef de Cuisine Backend Documentation

## Overview

The Chef de Cuisine backend is a Flask-based REST API designed for recipe management and discovery. It features advanced filtering capabilities using the Strategy Pattern, JWT-based authentication, and a two-layer filtering architecture for optimal performance.

### Deployment Architecture

The backend runs as an independent ECS Fargate service behind an Application Load Balancer with **path-based routing**:

**Production Access:**
- **Base URL**: `http://<load-balancer-dns>/api/v1/`
- **Routing Rule**: All `/api/*` requests → Flask backend service
- **Service Independence**: Scales separately from frontend (2-5 instances)
- **Container**: Python Flask + Werkzeug server

**Local Development:**
- **Base URL**: `http://localhost:5174/api/v1/`
- **Direct Access**: Flask development server on port 5174

**Key Benefits:**
- ✅ **Same Domain**: No CORS issues with frontend
- ✅ **Independent Scaling**: Auto-scales based on CPU usage
- ✅ **Health Monitoring**: ALB health checks on `/` endpoint

## Architecture & Design Patterns

### Core Architecture

```
┌──────────────────┐
│  Flask API   │
├──────────────────┤
│ JWT Middleware │
├──────────────────┤
│ SQLAlchemy ORM │
├──────────────────┤
│ PostgreSQL/SQLite│
└──────────────────┘
```

### Design Patterns Implemented

#### 1. Strategy Pattern for Recipe Filtering

The filtering system uses the Strategy Pattern to handle different types of recipe filters:

```python
# Abstract Strategy
class FilterStrategy:
  def validate(self) -> None:...
  def apply(self, recipe: Recipe) -> bool:...

# Concrete Strategies
class TimeFilterStrategy(FilterStrategy):...
class CuisineFilterStrategy(FilterStrategy):...
class IngredientFilterStrategy(FilterStrategy):...
#... and more
```

**Benefits:**
- Easy to add new filter types
- Encapsulated validation logic
- Consistent interface across all filters
- Testable and maintainable

#### 2. Two-Layer Filtering Architecture

**Layer 1: Database Level (SQL)**
- Fast numeric comparisons (time)
- Indexed text searches (cuisine, difficulty)
- Reduces data transferred from database

**Layer 2: Application Level (Strategy Pattern)**
- Complex JSON array filtering (tools, ingredients, taste)
- Partial string matching
- Business logic validation

```python
# Layer 1: SQL filtering
query = Recipe.query
if "time" in criteria:
  query = query.filter(Recipe.time <= int(criteria["time"]))

# Layer 2: Strategy Pattern filtering
engine = FilterEngine(criteria)
filtered = engine.apply(preliminary)
```

## Database Design

### Entity Relationship Diagram

```
┌──────────────┐    ┌──────────────┐    ┌─────────────┐
│  User   │    │  Favorite  │    │  Recipe  │
├──────────────┤    ├──────────────┤    ├─────────────┤
│ id (PK)   │◄─────►│ id (PK)   │◄─────►│ id (PK)   │
│ username   │    │ user_id(FK) │    │ name    │
│ email    │    │ recipe_id(FK)│    │ description │
│ password_hash│    └──────────────┘    │ image_url  │
└──────────────┘               │ time    │
                       │ cuisine   │
                       │ difficulty │
                       │ tools (JSON)│
                       │ ingredients │
                       │ taste (JSON)│
                       └─────────────┘
```

### Models

#### User Model
- **Purpose**: Authentication and user management
- **Relationships**: One-to-many with Favorite
- **Security**: Password hashing with Werkzeug PBKDF2

#### Recipe Model
- **Purpose**: Recipe data storage with filtering support
- **JSON Fields**: Tools, ingredients, taste stored as JSON text
- **Filtering**: Supports both SQL and application-level filtering

#### Favorite Model
- **Purpose**: Many-to-many relationship between users and recipes
- **Constraints**: Unique constraint on (user_id, recipe_id)
- **Cascade**: Automatic cleanup when user/recipe deleted

## API Endpoints

### Authentication Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/v1/auth/register` | POST | None | User registration |
| `/api/v1/auth/login` | POST | None | User login with JWT |
| `/api/v1/auth/logout` | POST | JWT | Logout (client-side) |
| `/api/v1/users/me` | GET | JWT | Get current user info |

### Recipe Management Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/v1/recipes` | GET | Optional | Get recommended recipes (limit 20) |
| `/api/v1/recipes` | POST | Optional | Create new recipe |
| `/api/v1/recipes/<id>` | GET | Optional | Get specific recipe by ID |
| `/api/v1/recipes/<name>` | PUT | Optional | Update recipe by name |
| `/api/v1/recipes/<name>` | DELETE | Optional | Delete recipe by name |
| `/api/v1/recipes/filter` | GET | Optional | Advanced filtering with Strategy Pattern |
| `/api/v1/recipes/search` | GET | Optional | Search by name (partial matching) |
| `/api/v1/admin/init-db` | POST | None | Initialize database with sample data |
| `/api/v1/admin/recipes` | DELETE | None | Delete all recipes (admin function) |

### Favorites Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/v1/favorites` | GET | JWT | Get user's favorites |
| `/api/v1/favorites` | POST | JWT | Add to favorites |
| `/api/v1/favorites/<id>` | DELETE | JWT | Remove from favorites |

## Advanced Filtering System

### Filter Types

#### 1. Time Filter
- **Purpose**: Filter by maximum cooking time
- **Type**: Numeric comparison
- **Example**: `?time=30` (recipes ≤ 30 minutes)
- **Implementation**: Database-level SQL filter

#### 2. Cuisine Filter
- **Purpose**: Filter by cuisine type
- **Type**: Text partial matching (case-insensitive)
- **Example**: `?cuisine=Italian`
- **Implementation**: Database-level SQL ILIKE

#### 3. Ingredient Filter
- **Purpose**: Filter by ingredients
- **Type**: JSON array partial matching
- **Example**: `?ingredients=chicken,pasta`
- **Implementation**: Strategy Pattern with substring matching

#### 4. Tools Filter
- **Purpose**: Filter by required cooking tools
- **Type**: JSON array exact matching
- **Example**: `?tools=oven,mixer`
- **Implementation**: Strategy Pattern with exact matching

#### 5. Taste Filter
- **Purpose**: Filter by taste profiles
- **Type**: JSON array matching
- **Example**: `?taste=spicy,savory`
- **Implementation**: Strategy Pattern

#### 6. Difficulty Filter
- **Purpose**: Filter by difficulty level
- **Type**: Text partial matching
- **Example**: `?difficulty=easy`
- **Implementation**: Database-level SQL ILIKE

### Filter Combination Examples

**Production (Single ALB):**
```bash
# Simple time filter
GET http://<load-balancer-dns>/api/v1/recipes/filter?time=30

# Cuisine and difficulty
GET http://<load-balancer-dns>/api/v1/recipes/filter?cuisine=Italian&difficulty=medium

# Complex multi-layer filtering
GET http://<load-balancer-dns>/api/v1/recipes/filter?time=45&cuisine=Asian&ingredients=chicken,ginger&tools=wok&taste=spicy
```

**Local Development:**
```bash
# Simple time filter
GET http://localhost:5174/api/v1/recipes/filter?time=30

# Cuisine and difficulty
GET http://localhost:5174/api/v1/recipes/filter?cuisine=Italian&difficulty=medium
```

## Authentication & Security

### JWT Implementation

**Custom JWT Implementation (Not Flask-JWT-Extended)**

The backend uses a custom JWT implementation using the PyJWT library for more control:

```python
# Custom JWT utility functions
def create_access_token(identity):
  """Create a JWT access token with user identity."""
  payload = {
    'user_id': identity,
    'exp': datetime.utcnow() + app.config["JWT_ACCESS_TOKEN_EXPIRES"],
    'iat': datetime.utcnow()
  }
  return jwt.encode(payload, app.config["JWT_SECRET_KEY"], algorithm='HS256')

def decode_token(token):
  """Decode and validate a JWT token."""
  try:
    payload = jwt.decode(token, app.config["JWT_SECRET_KEY"], algorithms=['HS256'])
    return payload
  except jwt.ExpiredSignatureError:
    return None
  except jwt.InvalidTokenError:
    return None

def get_jwt_identity():
  """Get the current user identity from JWT token."""
  auth_header = request.headers.get('Authorization')
  if not auth_header:
    return None
  
  try:
    token = auth_header.split(' ')[1] # Remove 'Bearer ' prefix
    payload = decode_token(token)
    if payload:
      return payload['user_id']
    return None
  except (IndexError, KeyError):
    return None

def jwt_required(optional=False):
  """Decorator to require JWT authentication."""
  def decorator(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
      user_id = get_jwt_identity()
      if user_id is None and not optional:
        return jsonify({'message': 'Token missing or invalid'}), 401
      return f(*args, **kwargs)
    return decorated_function
  return decorator

# Usage in endpoints
@jwt_required()
def protected_endpoint():
  user_id = get_jwt_identity() # Returns integer directly
  user = User.query.get_or_404(user_id)

# Optional authentication for public endpoints
@jwt_required(optional=True)
def public_endpoint():
  user_id = get_jwt_identity() # Returns None if no token, integer if authenticated
```

**Key Features:**
- **Custom Implementation**: Built with PyJWT for precise control over token handling
- **Integer User IDs**: Stores user_id as integer in JWT payload
- **Bearer Token**: Expects `Authorization: Bearer <token>` header format
- **Token Expiration**: 6-hour access token lifetime
- **Optional Authentication**: Flexible decorator supports both public and protected endpoints
- **Error Handling**: Graceful handling of expired/invalid tokens

### CORS Configuration for Authorization Headers

The API is configured to support cross-origin requests with JWT authorization headers using wildcard origin support:

```python
# Configure CORS to allow Authorization headers from any origin
# Using "*" for origins to avoid Flask-CORS boolean iteration bug
CORS(app,
   origins="*", # Allow all origins (wildcard)
   allow_headers=["Content-Type", "Authorization", "Accept", "Origin", "X-Requested-With"],
   methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
   supports_credentials=False, # Cannot use credentials with wildcard origins
   expose_headers=["Content-Type", "Authorization"]
)
```

**CORS Configuration:**
- **Wildcard Origins**: `origins="*"` allows any origin for maximum compatibility
- **Authorization Headers**: Full support for JWT token authentication across origins
- **Credentials Disabled**: Required when using wildcard origins per browser security policy
- **JWT Compatibility**: Works perfectly since JWT tokens are sent as headers, not credentials
- **Security Headers**: Comprehensive header support for modern web applications
- **Methods**: All HTTP methods needed for REST API operations

**Technical Note**: We use `origins="*"` instead of `origins=True` to avoid a Flask-CORS library bug where boolean values cause "argument of type 'bool' is not iterable" errors. The wildcard approach provides the same functionality while being more stable.

**Security Considerations**: 
- Wildcard origins allow any domain to make requests to the API
- JWT tokens in Authorization headers work regardless of credentials setting
- This configuration is suitable for public APIs and development environments
- For production with sensitive data, consider restricting to specific domains

### Security Features

1. **Password Hashing**: PBKDF2 with salt
2. **JWT Tokens**: 6-hour expiration
3. **Input Validation**: Required field validation
4. **SQL Injection Protection**: SQLAlchemy ORM
5. **CORS Security**: Restricted origins with authorization header support
6. **Graceful Error Handling**: No sensitive data leakage

## Error Handling & Resilience

### Graceful Degradation

The API implements graceful degradation for robustness:

```python
# Database not initialized
try:
  recipes = Recipe.query.all()
  return jsonify({"recipes": [r.to_dict() for r in recipes]})
except Exception:
  return jsonify({"recipes": []}) # Empty list instead of error
```

### Error Response Format

```json
{
 "message": "Error description",
 "error": "Error type (optional)"
}
```

### HTTP Status Codes

- **200**: Success
- **201**: Created
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (JWT required/invalid)
- **404**: Not Found
- **409**: Conflict (duplicate user)
- **500**: Internal Server Error

## Database Configuration

### Environment Variables

```bash
# PostgreSQL (Production)
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# Individual components (Alternative)
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=postgres

# JWT Configuration
JWT_SECRET_KEY=your-secret-key
```

### Database Fallbacks

1. **DATABASE_URL** (highest priority)
2. **Individual DB components** (DB_HOST, DB_USER, etc.)
3. **SQLite fallback** (localhost development)

```python
if os.getenv("DATABASE_URL"):
  database_url = os.getenv("DATABASE_URL")
else:
  # Build from components
  database_url = f"postgresql://{user}:{password}@{host}:5432/{db_name}"
  if host == "localhost":
    database_url = "sqlite:///local.db" # Fallback
```

## Data Flow

### Recipe Filtering Request Flow

```
1. HTTP Request
  ↓
2. Extract Query Parameters
  ↓
3. Layer 1: SQL Filtering (time, cuisine, difficulty)
  ↓
4. Database Query Execution
  ↓
5. Layer 2: Strategy Pattern Filtering (tools, ingredients, taste)
  ↓
6. Filter Engine Application
  ↓
7. JSON Response
```

### Authentication Flow

```
1. Login Request (username/password)
  ↓
2. User Verification
  ↓
3. JWT Token Generation
  ↓
4. Token Response
  ↓
5. Client Stores Token
  ↓
6. Subsequent Requests (Authorization: Bearer <token>)
  ↓
7. JWT Validation
  ↓
8. User Identity Extraction
```

## Sample Data

### Sample Recipes Structure

The system includes sample recipes in `sample_recipes.json`:

```json
[
 {
  "name": "Pasta Carbonara",
  "description": "Classic Italian pasta dish...",
  "time": 30,
  "cuisine": "Italian",
  "difficulty": "medium",
  "tools": ["pan", "pot", "whisk"],
  "ingredients": ["pasta", "eggs", "parmesan", "pancetta"],
  "taste": ["savory", "creamy", "rich"]
 }
]
```

### Database Initialization

**Option 1: API Endpoint**
```bash
POST /api/v1/admin/init-db
```

**Option 2: Flask CLI**
```bash
flask init-db
```

## Performance Considerations

### Database Optimization

1. **Indexed Fields**: Consider indexes on frequently filtered fields
2. **Two-Layer Architecture**: Reduces database load
3. **Limit Queries**: Default limit of 20 recipes for recommendations

### Memory Efficiency

1. **Lazy Loading**: SQLAlchemy relationships loaded on demand
2. **JSON Parsing**: Only parse JSON fields when needed
3. **Strategy Pattern**: Efficient filtering without loading all data

## Testing Strategy

### API Testing Examples

```bash
# Health check
curl http://localhost:5174/

# Initialize database
curl -X POST http://localhost:5174/api/v1/admin/init-db

# Get recipes
curl http://localhost:5174/api/v1/recipes

# Filter recipes
curl "http://localhost:5174/api/v1/recipes/filter?time=30&cuisine=Italian"

# Search recipes
curl "http://localhost:5174/api/v1/recipes/search?query=chicken"
```

### User Registration & Authentication

```bash
# Register user
curl -X POST http://localhost:5174/api/v1/auth/register \
 -H "Content-Type: application/json" \
 -d '{"username": "test", "email": "test@example.com", "password": "password"}'

# Login
curl -X POST http://localhost:5174/api/v1/auth/login \
 -H "Content-Type: application/json" \
 -d '{"username": "test", "password": "password"}'

# Response: {"access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...", "message": "Login successful"}

# Use token in subsequent requests
curl http://localhost:5174/api/v1/users/me \
 -H "Authorization: Bearer <jwt-token>" \
 -H "Content-Type: application/json"

# Get user's favorites (requires authentication)
curl http://localhost:5174/api/v1/favorites \
 -H "Authorization: Bearer <jwt-token>" \
 -H "Content-Type: application/json"

# Add recipe to favorites (requires authentication)
curl -X POST http://localhost:5174/api/v1/favorites \
 -H "Authorization: Bearer <jwt-token>" \
 -H "Content-Type: application/json" \
 -d '{"recipe_id": 1}'

# Remove from favorites (requires authentication)
curl -X DELETE http://localhost:5174/api/v1/favorites/1 \
 -H "Authorization: Bearer <jwt-token>" \
 -H "Content-Type: application/json"
```

### Cross-Origin Request Examples

From frontend (JavaScript):

```javascript
// Login and store token
const loginResponse = await fetch('http://localhost:5174/api/v1/auth/login', {
 method: 'POST',
 headers: {
  'Content-Type': 'application/json',
 },
 body: JSON.stringify({
  username: 'test',
  password: 'password'
 })
});
const { access_token } = await loginResponse.json();

// Use token in authenticated requests
const userResponse = await fetch('http://localhost:5174/api/v1/users/me', {
 headers: {
  'Authorization': `Bearer ${access_token}`,
  'Content-Type': 'application/json'
 }
});
const userData = await userResponse.json();

// Add to favorites
const favoriteResponse = await fetch('http://localhost:5174/api/v1/favorites', {
 method: 'POST',
 headers: {
  'Authorization': `Bearer ${access_token}`,
  'Content-Type': 'application/json'
 },
 body: JSON.stringify({ recipe_id: 1 })
});
```

## Deployment Architecture

### Local Development (Docker-Based)

The recommended local development setup uses Docker containers for consistent environments:

#### Using deploy.sh Script (Recommended)

```bash
# Build everything first (recommended)
./deploy.sh build

# Start all services
./deploy.sh start
```

**Available Commands:**

**Build Function (`./deploy.sh build`):**
1. **Validates Docker**: Checks if Docker is running
2. **Pulls PostgreSQL Image**: Downloads postgres:15-alpine
3. **Builds Backend Image**: Creates custom Flask container
4. **Installs Frontend Dependencies**: Runs npm install
5. **No Services Started**: Prepares everything without hosting

**Start Function (`./deploy.sh start`):**
1. **Clears Ports**: Kills processes on ports 5174, 5173, 5432
2. **Auto-Build**: Builds if images/dependencies missing
3. **Starts PostgreSQL**: Runs database container
4. **Starts Backend API**: Runs Flask container with database connection
5. **Starts Frontend**: Launches Vite development server

**Stop Function (`./deploy.sh stop`):**
- Stops all Docker containers
- Clears conflicting ports 
- Preserves build artifacts for quick restart

**Clean Function (`./deploy.sh clean`):**
- Stops all services
- Removes all Docker images
- Deletes node_modules and package-lock.json
- Complete cleanup for fresh start

**Status Function (`./deploy.sh status`):**
- Shows running/stopped status of all services
- Lists service URLs
- Shows build status of images and dependencies

**Services Created:**
- `chefdecuisine-db`: PostgreSQL 15 database container
- `chefdecuisine-backend`: Flask API container
- Frontend: Native Vite development server

**Configuration:**
```bash
# Database Connection
DATABASE_URL="postgresql://postgres:postgres@host.docker.internal:5432/chefdecuisine"

# JWT Secret
JWT_SECRET_KEY="local-development-secret-key"

# Ports
Database: 5432
Backend: 5174
Frontend: 5173
```

#### Manual Local Development (Alternative)

```bash
# Install dependencies
pip install -r requirements.txt

# Set environment variables
export DATABASE_URL="sqlite:///local.db"
export JWT_SECRET_KEY="local-development-secret"

# Initialize database
python app.py

# Run development server
flask run
```

### Production Deployment (AWS ECS)

The backend is containerized and deployed on AWS ECS using Infrastructure as Code (Terraform):

#### Infrastructure Components

1. **ECR (Elastic Container Registry)**
  - Stores Docker images
  - Repository: `chefde-cuisine-backend`
  - Automatic image versioning

2. **ECS Fargate (Serverless Containers)**
  - Serverless container orchestration
  - Auto-scaling based on CPU utilization (2-5 instances)
  - No server management required

3. **RDS PostgreSQL**
  - Managed database service
  - Multi-AZ deployment for high availability
  - Automatic backups and maintenance

4. **Application Load Balancer (ALB)**
  - HTTP/HTTPS traffic distribution
  - Health checks on `/` endpoint
  - SSL termination capability

5. **CloudWatch**
  - Centralized logging
  - Performance monitoring
  - Auto-scaling metrics

#### Deployment Process

**1. Automated Deployment Script**
```bash
./deploy.sh
```

**What deploy.sh does:**
```bash
#!/usr/bin/env bash
set -euo pipefail

terraform init -input=false
terraform apply -auto-approve -input=false

# After apply, retrieve the load balancer DNS name from Terraform output
LB_DNS=$(terraform output -raw load_balancer_dns)

echo -e "\nDeployment complete. Load balancer DNS: $LB_DNS"
```

**2. Terraform Infrastructure (main.tf)**
The deployment uses a comprehensive Terraform configuration that:

- **Creates VPC and Networking**: Uses default VPC with multiple subnets
- **Builds ECR Repository**: Container registry for backend images
- **Configures ECS Cluster**: Fargate-based container cluster
- **Sets up RDS Database**: PostgreSQL with automated password generation
- **Creates Load Balancer**: ALB with health checks and auto-scaling
- **Manages IAM Roles**: Uses LabRole for simplified permissions

**3. Docker Image Build & Push**
```bash
# Terraform automatically builds and pushes during deployment
resource "null_resource" "docker_build_push" {
 triggers = {
  dockerfile_hash = filemd5("${path.module}/backend/Dockerfile")
  app_hash    = filemd5("${path.module}/backend/app.py")
 }

 provisioner "local-exec" {
  command = <<-EOT
   aws ecr get-login-password --region ${var.aws_region} | docker login --username AWS --password-stdin ${aws_ecr_repository.app.repository_url}
   docker build -t ${aws_ecr_repository.app.repository_url}:${var.ecr_image_tag} ${path.module}/backend/
   docker push ${aws_ecr_repository.app.repository_url}:${var.ecr_image_tag}
  EOT
 }
}
```

#### Container Configuration

**Dockerfile (Production)**
```dockerfile
FROM python:3.11-slim

# Install build tools for psycopg2
RUN apt-get update && apt-get install -y build-essential libpq-dev --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

# Set workdir
WORKDIR /app

# Copy requirements and install
COPY requirements.txt./
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY..

ENV FLASK_APP=app.py
ENV PYTHONUNBUFFERED=1

EXPOSE 5000

CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]
```

**ECS Task Definition**
```json
{
 "family": "chefdeCuisine-task",
 "networkMode": "awsvpc",
 "requiresCompatibilities": ["FARGATE"],
 "cpu": "256",
 "memory": "512",
 "containerDefinitions": [
  {
   "name": "backend",
   "image": "${ECR_REPOSITORY_URL}:latest",
   "portMappings": [
    {
     "containerPort": 5000,
     "protocol": "tcp"
    }
   ],
   "environment": [
    {
     "name": "DATABASE_URL",
     "value": "postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:5432/${DB_NAME}"
    },
    {
     "name": "JWT_SECRET_KEY",
     "value": "${JWT_SECRET}"
    }
   ],
   "logConfiguration": {
    "logDriver": "awslogs",
    "options": {
     "awslogs-group": "/ecs/chefdeCuisine",
     "awslogs-region": "us-east-1"
    }
   }
  }
 ]
}
```

#### Environment Variables (Production)

```bash
# Database Configuration
DATABASE_URL="postgresql://postgres:${auto_generated_password}@${rds_endpoint}:5432/chefdecuisine"
DB_HOST="${rds_endpoint}"
DB_USER="postgres"
DB_PASSWORD="${auto_generated_password}"
DB_NAME="chefdecuisine"

# Security
JWT_SECRET_KEY="${secure_random_key}"

# Flask Configuration
FLASK_ENV="production"
PYTHONUNBUFFERED="1"
```

#### Auto-Scaling Configuration

```bash
# CPU-based scaling
Target CPU Utilization: 70%
Minimum Capacity: 2 instances
Maximum Capacity: 5 instances
Scale Out: Add 1 instance when CPU > 70% for 2 minutes
Scale In: Remove 1 instance when CPU < 70% for 5 minutes
```

#### Health Checks & Monitoring

**Application Load Balancer Health Check:**
- **Path**: `/`
- **Expected Response**: `{"status": "healthy", "message": "Chef de Cuisine API is running"}`
- **Interval**: 30 seconds
- **Timeout**: 5 seconds
- **Healthy Threshold**: 2 consecutive successes
- **Unhealthy Threshold**: 3 consecutive failures

**CloudWatch Monitoring:**
- **Log Group**: `/ecs/chefdeCuisine`
- **Metrics**: CPU utilization, memory usage, request count
- **Retention**: 14 days

#### Security Configuration

**Network Security:**
- **VPC**: Uses default VPC with multiple availability zones
- **Security Groups**: 
 - ALB: Allows HTTP (80) and HTTPS (443) from internet
 - ECS: Allows traffic from ALB on port 5000
 - RDS: Allows traffic from ECS on port 5432

**IAM Roles:**
- **Execution Role**: LabRole (for pulling images, writing logs)
- **Task Role**: LabRole (for application permissions)

#### Deployment Verification

**After deployment, verify services:**
```bash
# Get load balancer URL
terraform output load_balancer_dns

# Test health endpoint
curl http://${LB_DNS}/

# Test API endpoints
curl http://${LB_DNS}/api/v1/recipes

# Initialize database (first deployment)
curl -X POST http://${LB_DNS}/api/v1/admin/init-db
```

### Container Configuration Comparison

| Environment | Database | Container Platform | Scaling | Monitoring |
|-------------|----------|-------------------|---------|------------|
| **Local** | PostgreSQL Container | Docker Desktop | Manual | Terminal logs |
| **Production** | RDS PostgreSQL | ECS Fargate | Auto (2-5) | CloudWatch |

## Monitoring & Observability

### Health Checks

**Endpoint**: `GET /`
**Response**: `{"status": "healthy", "message": "Chef de Cuisine API is running"}`

### Logging

- **Application Logs**: Flask request/response logging
- **CloudWatch**: Centralized logging in AWS
- **Error Tracking**: Detailed error messages without sensitive data

### Metrics

- **Response Times**: API endpoint performance
- **Error Rates**: 4xx/5xx response tracking
- **Database Queries**: Query performance monitoring

## Future Enhancements

### Potential Improvements

1. **Caching**: Redis for frequently accessed recipes
2. **Full-Text Search**: Elasticsearch for advanced search
3. **Rate Limiting**: API rate limiting for abuse prevention
4. **API Versioning**: Structured versioning strategy
5. **Database Indexes**: Performance optimization
6. **Background Jobs**: Async processing for heavy operations
7. **Recipe Recommendations**: ML-based recommendation engine

### Scalability Considerations

1. **Horizontal Scaling**: Multiple ECS tasks behind load balancer
2. **Database Scaling**: RDS read replicas
3. **CDN**: CloudFront for static assets
4. **Microservices**: Split into smaller services if needed

## Testing

### Backend Testing Architecture

The backend uses **K6** for comprehensive load testing and API validation. Testing focuses on performance, reliability, and functional correctness under various load conditions.

#### Test Structure

```
backend/test/
├── Readme.md                     # Testing documentation and setup guide
└── recipes_test.js               # Comprehensive K6 load test script
```

#### Testing Framework: K6

**Why K6:**
- **Performance Testing**: Designed for load and stress testing
- **JavaScript-Based**: Easy to write and maintain tests
- **Real API Testing**: Tests actual HTTP endpoints
- **Metrics & Reporting**: Detailed performance metrics
- **CI/CD Integration**: Automated testing in pipelines

#### Running Tests

```bash
# Set the API endpoint (local or production)
export ENDPOINT=http://localhost:5174

# Run the comprehensive test suite
k6 run backend/test/recipes_test.js

# For production/staging testing
export ENDPOINT=http://chefdecuisine-alb-1272383064.us-east-1.elb.amazonaws.com
k6 run backend/test/recipes_test.js

# Run with custom load parameters
k6 run --vus 10 --duration 30s backend/test/recipes_test.js
```

#### Test Scenarios

The test suite includes two main scenarios:

**1. Registration & Login Flow (`registration_login_flow`)**
- **Load Pattern**: Ramp up to 15 concurrent users over 3 minutes
- **User Journey**: Complete user lifecycle testing
- **Coverage**: Registration, login, recipe CRUD, search, filtering, favorites

Test progression:
```javascript
stages: [
  { duration: '1m', target: 5 },   // Ramp up to 5 users
  { duration: '1m', target: 15 },  // Increase to 15 users  
  { duration: '1m', target: 0 },   // Ramp down to 0
]
```

**2. API Stress Test (`api_stress`)**
- **Load Pattern**: High-load stress testing with 50 concurrent users
- **Focus**: System stability under heavy load
- **Authentication**: Uses pre-configured test account

Stress test progression:
```javascript
stages: [
  { duration: '2m', target: 25 },  // Ramp up to 25 users
  { duration: '2m', target: 50 },  // Stress test with 50 users
  { duration: '1m', target: 0 },   // Graceful shutdown
]
```

#### Test Coverage

**Authentication Testing:**
- User registration with random credentials
- Login and JWT token acquisition  
- Token validation and usage
- Duplicate registration handling (409 responses)

**Recipe API Testing:**
- `GET /api/v1/recipes` - Recipe listing
- `POST /api/v1/recipes` - Recipe creation
- `GET /api/v1/recipes/search` - Recipe search functionality
- `GET /api/v1/recipes/filter` - Advanced filtering (cuisine, time, etc.)

**Favorites Management:**
- `POST /api/v1/favorites` - Add recipe to favorites
- `GET /api/v1/favorites` - List user favorites
- `DELETE /api/v1/favorites/{id}` - Remove from favorites

**Error Handling:**
- Network timeout handling
- API error response validation
- Authentication failure scenarios
- Database connectivity issues

#### Example Test Implementation

```javascript
// User registration and authentication
function registerAndLogin() {
  const username = "test_" + randomStr(8);
  const password = "P@ssw0rd" + randomStr(3);
  const email = username + "@test.com";

  // Registration
  let res = http.post(`${ENDPOINT}/api/v1/auth/register`, 
    JSON.stringify({ username, email, password }), 
    { headers: { "Content-Type": "application/json" } }
  );
  
  // Handle both new registrations (201) and existing users (409)
  if (!(res.status === 201 || res.status === 409)) {
    registerFail.add(1);
    return null;
  }

  // Login and get JWT token
  res = http.post(`${ENDPOINT}/api/v1/auth/login`, 
    JSON.stringify({ username, password }), 
    { headers: { "Content-Type": "application/json" } }
  );
  
  return res.status === 200 ? res.json().access_token : null;
}

// Recipe operations with authentication
function recipesCrud(token) {
  // GET recipes with authentication
  let res = http.get(`${ENDPOINT}/api/v1/recipes`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  check(res, { "GET recipes status 200": (r) => r.status === 200 });

  // POST new recipe
  const newRecipe = {
    name: "test_" + randomStr(5),
    description: "Test recipe description",
    time: Math.floor(Math.random() * 60) + 10,
    cuisine: "TestCuisine",
    difficulty: "easy",
    tools: ["pan", "pot"],
    ingredients: ["egg", "rice"],
    taste: ["umami", "fresh"]
  };
  
  res = http.post(`${ENDPOINT}/api/v1/recipes`, 
    JSON.stringify(newRecipe), 
    { headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` 
      }
    }
  );
  check(res, { "POST recipe status 201": (r) => r.status === 201 });
}
```

#### Performance Metrics

K6 automatically tracks and reports:

**Request Metrics:**
- `requests_attempted`: Total API calls made
- `success`: Successful operations per endpoint
- `errors`: Failed requests with categorization
- `http_req_duration`: Response time percentiles (p95, p99)
- `http_req_rate`: Requests per second

**Authentication Metrics:**
- `register_fail`: Registration failure count
- `login_fail`: Login failure count
- `auth_success`: Successful authentication rate

**Business Logic Metrics:**
- Endpoint-specific success rates (recipes, search, favorites)
- Error categorization by API endpoint
- User flow completion rates

#### Testing Best Practices

**Load Test Design:**
- **Realistic User Patterns**: Tests mimic actual user behavior
- **Gradual Load Increase**: Ramp-up periods prevent sudden spikes
- **Mixed Scenarios**: Combine different user types and behaviors
- **Environment Isolation**: Use dedicated test data and accounts

**Data Management:**
- **Random Test Data**: Generate unique usernames, recipes, searches
- **Cleanup Strategy**: Tests are designed to be repeatable
- **Test Account Strategy**: Pre-created accounts for stress testing

**Monitoring During Tests:**
- **Resource Usage**: Monitor CPU, memory, database connections
- **Application Logs**: Watch for errors and warnings
- **Database Performance**: Monitor query performance and locks
- **Load Balancer Health**: Check healthy instance counts

#### Continuous Integration Testing

```bash
# CI Pipeline Testing
export ENDPOINT=http://staging.chefdecuisine.com
k6 run --vus 5 --duration 2m backend/test/recipes_test.js

# Performance regression testing
k6 run --out json=results.json backend/test/recipes_test.js
k6 analyze results.json
```

**Automated Testing Triggers:**
- Pre-deployment validation
- Nightly performance regression tests
- Post-deployment verification
- Staging environment validation

#### Local Development Testing

```bash
# Start local environment
./deploy.sh start

# Wait for services to be ready
sleep 30

# Run tests against local API
export ENDPOINT=http://localhost:5174
k6 run backend/test/recipes_test.js

# Verify results and service health
./deploy.sh status
```

This comprehensive testing approach ensures the Chef de Cuisine backend maintains high performance and reliability across different load conditions and usage patterns.

This documentation provides a comprehensive understanding of the Chef de Cuisine backend architecture, implementation details, and operational considerations. 