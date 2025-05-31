# Chef de Cuisine Backend Documentation

## Overview

The Chef de Cuisine backend is a Flask-based REST API designed for recipe management and discovery. It features advanced filtering capabilities using the Strategy Pattern, JWT-based authentication, and a two-layer filtering architecture for optimal performance.

## Architecture & Design Patterns

### Core Architecture

```
┌──────────────────┐
│    Flask API     │
├──────────────────┤
│  JWT Middleware  │
├──────────────────┤
│  SQLAlchemy ORM  │
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
    def validate(self) -> None: ...
    def apply(self, recipe: Recipe) -> bool: ...

# Concrete Strategies
class TimeFilterStrategy(FilterStrategy): ...
class CuisineFilterStrategy(FilterStrategy): ...
class IngredientFilterStrategy(FilterStrategy): ...
# ... and more
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
┌──────────────┐       ┌──────────────┐       ┌─────────────┐
│    User      │       │   Favorite   │       │   Recipe    │
├──────────────┤       ├──────────────┤       ├─────────────┤
│ id (PK)      │◄─────►│ id (PK)      │◄─────►│ id (PK)     │
│ username     │       │ user_id(FK)  │       │ name        │
│ email        │       │ recipe_id(FK)│       │ description │
│ password_hash│       └──────────────┘       │ image_url   │
└──────────────┘                              │ time        │
                                              │ cuisine     │
                                              │ difficulty  │
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
| `/api/v1/recipes` | GET | Optional | Get recommended recipes |
| `/api/v1/recipes` | POST | Optional | Create new recipe |
| `/api/v1/recipes/<id>` | GET | Optional | Get specific recipe |
| `/api/v1/recipes/filter` | GET | Optional | Advanced filtering |
| `/api/v1/recipes/search` | GET | Optional | Search by name |
| `/api/v1/admin/init-db` | POST | None | Initialize database |

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

```bash
# Simple time filter
GET /api/v1/recipes/filter?time=30

# Cuisine and difficulty
GET /api/v1/recipes/filter?cuisine=Italian&difficulty=medium

# Complex multi-layer filtering
GET /api/v1/recipes/filter?time=45&cuisine=Asian&ingredients=chicken,ginger&tools=wok&taste=spicy
```

## Authentication & Security

### JWT Implementation

```python
# Token generation
access_token = create_access_token(identity=user.id)

# Token validation
@jwt_required()  # Required
@jwt_required(optional=True)  # Optional
```

### Security Features

1. **Password Hashing**: PBKDF2 with salt
2. **JWT Tokens**: 6-hour expiration
3. **Input Validation**: Required field validation
4. **SQL Injection Protection**: SQLAlchemy ORM
5. **Graceful Error Handling**: No sensitive data leakage

## Error Handling & Resilience

### Graceful Degradation

The API implements graceful degradation for robustness:

```python
# Database not initialized
try:
    recipes = Recipe.query.all()
    return jsonify({"recipes": [r.to_dict() for r in recipes]})
except Exception:
    return jsonify({"recipes": []})  # Empty list instead of error
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
        database_url = "sqlite:///local.db"  # Fallback
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
curl http://localhost:5000/

# Initialize database
curl -X POST http://localhost:5000/api/v1/admin/init-db

# Get recipes
curl http://localhost:5000/api/v1/recipes

# Filter recipes
curl "http://localhost:5000/api/v1/recipes/filter?time=30&cuisine=Italian"

# Search recipes
curl "http://localhost:5000/api/v1/recipes/search?query=chicken"
```

### User Registration & Authentication

```bash
# Register user
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "test", "email": "test@example.com", "password": "password"}'

# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "test", "password": "password"}'

# Use token
curl http://localhost:5000/api/v1/users/me \
  -H "Authorization: Bearer <jwt-token>"
```

## Deployment Architecture

### Local Development
```bash
# Install dependencies
pip install -r requirements.txt

# Initialize database
flask init-db

# Run development server
python app.py
```

### Production Deployment (AWS ECS)

The backend is containerized and deployed on AWS ECS with:

1. **ECR**: Container registry for Docker images
2. **ECS Fargate**: Serverless container hosting
3. **RDS PostgreSQL**: Managed database service
4. **ALB**: Application Load Balancer
5. **CloudWatch**: Logging and monitoring

### Docker Configuration

```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["python", "app.py"]
```

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

This documentation provides a comprehensive understanding of the Chef de Cuisine backend architecture, implementation details, and operational considerations. 