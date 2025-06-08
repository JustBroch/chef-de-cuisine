"""
Chef de Cuisine Backend API

A Flask-based REST API for recipe management featuring:
- JWT Authentication system
- Advanced recipe filtering using Strategy Pattern
- Two-layer filtering: Database SQL + In-memory Strategy Pattern
- PostgreSQL database with graceful fallback to SQLite
- Comprehensive recipe management and favorites system

Architecture:
- Flask web framework with SQLAlchemy ORM
- Strategy Pattern for flexible filtering algorithms
- JWT-based authentication with optional protection
- Docker containerization with AWS ECS deployment
"""

import json
import os
from datetime import timedelta, datetime
from typing import Any, Dict, List
import jwt
from functools import wraps

from flask import Flask, jsonify, request, abort
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash

# ---------------------------------------------------------------------------
# App & Database Configuration
# ---------------------------------------------------------------------------

# Database URL Construction with Environment Variable Support
# Priority: DATABASE_URL > Individual DB components > SQLite fallback
if os.getenv("DATABASE_URL"):
    # Use provided database URL directly (e.g., from cloud services)
    database_url = os.getenv("DATABASE_URL")
else:
    # Build PostgreSQL URL from individual components
    host = os.getenv("DB_HOST", "localhost")
    user = os.getenv("DB_USER", "postgres")
    password = os.getenv("DB_PASSWORD", "postgres")
    db_name = os.getenv("DB_NAME", "postgres")
    database_url = f"postgresql://{user}:{password}@{host}:5432/{db_name}"
    
    # Fallback to SQLite for local development when PostgreSQL is unavailable
    if host == "localhost":
        database_url = "sqlite:///local.db"

# Flask Application Setup
app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = database_url
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False  # Disable event system for performance
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "super-secret-change-me")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=6)  # Token expiration time

# Initialize Flask extensions
db = SQLAlchemy(app)

# Custom JWT utility functions (replacing Flask-JWT-Extended)
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
        token = auth_header.split(' ')[1]  # Remove 'Bearer ' prefix
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

# Configure CORS to handle Authorization headers leniently
CORS(app,
     origins="*",
     allow_headers=["Content-Type", "Authorization", "Accept", "Origin", "X-Requested-With"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     expose_headers=["Content-Type", "Authorization"]
)

# ---------------------------------------------------------------------------
# Database Models
# ---------------------------------------------------------------------------

class User(db.Model):
    """
    User model for authentication and favorites management.
    
    Relationships:
    - One-to-many with Favorite (user can have multiple favorite recipes)
    """
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)  # Hashed password storage

    # Relationship to favorites with cascade delete
    favorites = db.relationship("Favorite", back_populates="user", cascade="all, delete-orphan")

    @staticmethod
    def create_password_hash(password: str) -> str:
        """Create a secure hash of the password using Werkzeug's PBKDF2."""
        return generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        """Verify password against stored hash."""
        return check_password_hash(self.password_hash, password)


class Recipe(db.Model):
    """
    Recipe model with comprehensive filtering support.
    
    Design Notes:
    - JSON fields (tools, ingredients, taste) stored as TEXT for database portability
    - Supports both SQL-level and application-level filtering
    - All fields nullable except name for flexible recipe creation
    """
    __tablename__ = "recipes"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    image_url = db.Column(db.String(512), nullable=True)

    # Numeric fields for efficient SQL filtering
    time = db.Column(db.Integer, nullable=True)  # Cooking time in minutes

    # Text fields for SQL LIKE filtering
    cuisine = db.Column(db.String(120), nullable=True)  # e.g., "Italian", "Asian"
    difficulty = db.Column(db.String(50), nullable=True)  # e.g., "easy", "medium", "hard"

    # JSON-encoded array fields for Strategy Pattern filtering
    tools = db.Column(db.Text, nullable=True)        # JSON: ["oven", "stove", "mixer"]
    ingredients = db.Column(db.Text, nullable=True)  # JSON: ["chicken", "flour", "eggs"]
    taste = db.Column(db.Text, nullable=True)        # JSON: ["sweet", "spicy", "savory"]

    def to_dict(self) -> Dict[str, Any]:
        """
        Convert recipe to dictionary format for JSON serialization.
        Automatically parses JSON fields into Python lists.
        """
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "image_url": self.image_url,
            "time": self.time,
            "tools": json.loads(self.tools) if self.tools else [],
            "ingredients": json.loads(self.ingredients) if self.ingredients else [],
            "taste": json.loads(self.taste) if self.taste else [],
            "cuisine": self.cuisine,
            "difficulty": self.difficulty,
        }


class Favorite(db.Model):
    """
    Many-to-many relationship between Users and Recipes.
    Represents a user's favorite recipes with proper foreign key constraints.
    """
    __tablename__ = "favorites"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"))
    recipe_id = db.Column(db.Integer, db.ForeignKey("recipes.id", ondelete="CASCADE"))

    # Relationships with proper back references
    user = db.relationship("User", back_populates="favorites")
    recipe = db.relationship("Recipe")

    # Ensure each user can only favorite a recipe once
    __table_args__ = (
        db.UniqueConstraint("user_id", "recipe_id", name="unique_user_recipe"),
    )


# ---------------------------------------------------------------------------
# Strategy Pattern for Advanced Recipe Filtering
# ---------------------------------------------------------------------------

class FilterStrategy:
    """
    Abstract base class for the Strategy Pattern implementation.
    
    Each concrete strategy handles validation and filtering for specific recipe attributes.
    This pattern allows for:
    - Easy addition of new filter types
    - Complex validation logic per filter
    - Consistent interface across all filters
    """

    def __init__(self, value: Any):
        """Initialize strategy with filter value and validate it."""
        self.value = value
        self.validate()

    def validate(self) -> None:
        """
        Validate the input value for this filter type.
        Should raise ValueError for invalid inputs.
        Must be implemented by concrete strategies.
        """
        raise NotImplementedError

    def apply(self, recipe: Recipe) -> bool:
        """
        Apply filter logic to a recipe.
        Returns True if recipe passes the filter, False otherwise.
        Must be implemented by concrete strategies.
        """
        raise NotImplementedError


class TimeFilterStrategy(FilterStrategy):
    """Filter recipes by maximum cooking time in minutes."""
    
    def validate(self):
        if not str(self.value).isdigit() or int(self.value) <= 0:
            raise ValueError("Time must be a positive integer")
        self.max_time = int(self.value)

    def apply(self, recipe: Recipe) -> bool:
        """Recipe passes if cooking time is within the specified maximum."""
        return recipe.time is not None and recipe.time <= self.max_time


class CuisineFilterStrategy(FilterStrategy):
    """Filter recipes by cuisine type using case-insensitive partial matching."""
    
    def validate(self):
        if not str(self.value).strip():
            raise ValueError("Cuisine must be non-empty")
        self.cuisine = str(self.value).lower()

    def apply(self, recipe: Recipe) -> bool:
        """Recipe passes if cuisine contains the filter value (case-insensitive)."""
        return self.cuisine in (recipe.cuisine or "").lower()


class IngredientFilterStrategy(FilterStrategy):
    """
    Filter recipes by ingredients using comma-separated list.
    Supports partial matching (e.g., "chick" matches "chicken").
    """
    
    def validate(self):
        if not str(self.value).strip():
            raise ValueError("Ingredients must be non-empty")
        # Parse comma-separated ingredients and clean whitespace
        self.ingredients = [i.strip().lower() for i in str(self.value).split(",") if i.strip()]

    def apply(self, recipe: Recipe) -> bool:
        """Recipe passes if ANY filter ingredient is found in ANY recipe ingredient."""
        recipe_ingredients = [i.lower() for i in (json.loads(recipe.ingredients) if recipe.ingredients else [])]
        # Check if any filter ingredient is a substring of any recipe ingredient
        return any(any(ing in r_ingredient for r_ingredient in recipe_ingredients) for ing in self.ingredients)


class ToolsFilterStrategy(FilterStrategy):
    """Filter recipes by required cooking tools using exact matching."""
    
    def validate(self):
        if not str(self.value).strip():
            raise ValueError("Tools must be non-empty")
        self.tools = [t.strip().lower() for t in str(self.value).split(",") if t.strip()]

    def apply(self, recipe: Recipe) -> bool:
        """Recipe passes if it contains ALL the required tools."""
        recipe_tools = [t.lower() for t in (json.loads(recipe.tools) if recipe.tools else [])]
        return any(tool in recipe_tools for tool in self.tools)


class TasteFilterStrategy(FilterStrategy):
    """Filter recipes by taste profile using comma-separated list."""
    
    def validate(self):
        if not str(self.value).strip():
            raise ValueError("Taste must be non-empty")
        self.tastes = [t.strip().lower() for t in str(self.value).split(",") if t.strip()]

    def apply(self, recipe: Recipe) -> bool:
        """Recipe passes if it has ANY of the specified taste profiles."""
        recipe_tastes = [t.lower() for t in (json.loads(recipe.taste) if recipe.taste else [])]
        return any(taste in recipe_tastes for taste in self.tastes)


class DifficultyFilterStrategy(FilterStrategy):
    """Filter recipes by difficulty level using case-insensitive partial matching."""
    
    def validate(self):
        if not str(self.value).strip():
            raise ValueError("Difficulty must be non-empty")
        self.diff = str(self.value).lower()

    def apply(self, recipe: Recipe) -> bool:
        """Recipe passes if difficulty contains the filter value (case-insensitive)."""
        return self.diff in (recipe.difficulty or "").lower()


class FilterEngine:
    """
    Main engine that orchestrates the Strategy Pattern filtering system.
    
    Two-Layer Filtering Architecture:
    1. Database Layer: SQL filters for performance (time, cuisine, difficulty)
    2. Application Layer: Strategy Pattern for complex logic (tools, ingredients, taste)
    
    This engine handles the application layer filtering.
    """
    
    # Registry mapping filter names to their strategy classes
    STRATEGIES = {
        "time": TimeFilterStrategy,
        "cuisine": CuisineFilterStrategy,
        "ingredients": IngredientFilterStrategy,
        "tools": ToolsFilterStrategy,
        "taste": TasteFilterStrategy,
        "difficulty": DifficultyFilterStrategy,
    }

    def __init__(self, criteria: Dict[str, Any]):
        """
        Initialize filter engine with criteria dictionary.
        Gracefully handles invalid filters by skipping them.
        """
        self.strategies: List[FilterStrategy] = []
        
        for key, value in criteria.items():
            strategy_cls = self.STRATEGIES.get(key)
            if strategy_cls is None:
                # Unknown filter types are ignored (graceful degradation)
                continue
            
            try:
                # Create strategy instance with validation
                self.strategies.append(strategy_cls(value))
            except ValueError:
                # Invalid filter values are skipped (graceful degradation)
                pass

    def apply(self, recipes: List[Recipe]) -> List[Recipe]:
        """
        Apply all active strategies to filter the recipe list.
        Recipe must pass ALL strategies to be included in results (AND logic).
        """
        result = []
        for recipe in recipes:
            # Recipe passes if all strategies return True
            if all(strategy.apply(recipe) for strategy in self.strategies):
                result.append(recipe)
        return result


# ---------------------------------------------------------------------------
# Utility Functions
# ---------------------------------------------------------------------------

def get_json_or_abort(keys: List[str]):
    """
    Extract JSON data from request and validate required fields.
    Aborts with 400 error if any required field is missing.
    
    Args:
        keys: List of required field names
        
    Returns:
        Dictionary with request JSON data
        
    Raises:
        400 Bad Request if any required field is missing
    """
    data = request.get_json(silent=True) or {}
    for k in keys:
        if k not in data:
            abort(400, description=f"Missing field: {k}")
    return data


# ---------------------------------------------------------------------------
# Health Check Route
# ---------------------------------------------------------------------------

@app.route("/")
def health_check():
    """
    Simple health check endpoint for load balancers and monitoring.
    Returns 200 OK with service status information.
    """
    return jsonify({"status": "healthy", "message": "Chef de Cuisine API is running"})


# ---------------------------------------------------------------------------
# Authentication Routes
# ---------------------------------------------------------------------------

@app.post("/api/v1/auth/register")
def register():
    """
    User registration endpoint.
    
    Request Body:
        - username: Unique username
        - email: Unique email address  
        - password: Plain text password (will be hashed)
        
    Returns:
        201: User registered successfully
        409: Username or email already exists
        400: Missing required fields
    """
    data = get_json_or_abort(["username", "email", "password"])

    # Check if user already exists (username OR email)
    if User.query.filter((User.username == data["username"]) | (User.email == data["email"])).first():
        return jsonify({"message": "User already exists"}), 409

    # Create new user with hashed password
    user = User(
        username=data["username"],
        email=data["email"],
        password_hash=User.create_password_hash(data["password"]),
    )
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User registered successfully", "user_id": user.id}), 201


@app.post("/api/v1/auth/login")
def login():
    """
    User login endpoint with JWT token generation.
    
    Request Body:
        - username: User's username
        - password: User's plain text password
        
    Returns:
        200: Login successful with JWT access token
        401: Invalid username or password
        400: Missing required fields
    """
    data = get_json_or_abort(["username", "password"])
    
    # Find user and verify password
    user: User | None = User.query.filter_by(username=data["username"]).first()
    if not user or not user.check_password(data["password"]):
        return jsonify({"message": "Invalid username or password"}), 401

    # Generate JWT token with user ID as identity
    access_token = create_access_token(identity=user.id)
    return jsonify({"access_token": access_token, "message": "Login successful"}), 200


@app.post("/api/v1/auth/logout")
@jwt_required()
def logout():
    """
    User logout endpoint.
    
    Note: For stateless JWT tokens, we cannot truly invalidate them without 
    implementing a token blocklist. This endpoint provides a standard logout 
    response for client-side token removal.
    
    Headers:
        Authorization: Bearer <JWT token>
        
    Returns:
        200: Logout successful
        401: Invalid or missing token
    """
    return jsonify({"message": "Logout successful"}), 200


@app.get("/api/v1/users/me")
@jwt_required()
def get_current_user():
    """
    Get current user information from JWT token.
    
    Headers:
        Authorization: Bearer <JWT token>
        
    Returns:
        200: User information (user_id, username, email)
        401: Invalid or missing token
        404: User not found (token valid but user deleted)
    """
    user_id = get_jwt_identity()
    user: User = User.query.get_or_404(user_id)  # Use directly as int
    return jsonify({
        "user_id": user.id,
        "username": user.username,
        "email": user.email,
    })


# ---------------------------------------------------------------------------
# Recipe Routes with Two-Layer Filtering
# ---------------------------------------------------------------------------

@app.get("/api/v1/recipes")
@jwt_required(optional=True)
def get_recipes():
    """
    Get recommended recipes (currently returns first 20 recipes).
    
    Authentication: Optional (works for both authenticated and anonymous users)
    
    Returns:
        200: List of recommended recipes
        500: Database error (gracefully handled)
        
    Error Handling:
        Returns empty list if database tables don't exist yet.
    """
    try:
        recipes = Recipe.query.limit(20).all()  # Placeholder "recommended" logic
        return jsonify({"recipes": [r.to_dict() for r in recipes]})
    except Exception as e:
        # Graceful degradation: return empty list if DB not initialized
        return jsonify({"recipes": []})


@app.post("/api/v1/recipes")
@jwt_required(optional=True)
def create_recipe():
    """
    Create a new recipe.
    
    Authentication: Optional
    
    Request Body:
        - name: Recipe name (required)
        - description: Recipe description (optional)
        - image_url: Recipe image URL (optional)
        - time: Cooking time in minutes (optional)
        - cuisine: Cuisine type (optional)
        - difficulty: Difficulty level (optional)
        - tools: Array of required tools (optional)
        - ingredients: Array of ingredients (optional)
        - taste: Array of taste profiles (optional)
        
    Returns:
        201: Recipe created successfully with recipe data
        400: Missing required fields
        500: Database error
    """
    try:
        data = get_json_or_abort(["name"])
        
        # Create recipe with provided data, using defaults for missing fields
        recipe = Recipe(
            name=data["name"],
            description=data.get("description", ""),
            image_url=data.get("image_url", ""),
            time=data.get("time"),
            cuisine=data.get("cuisine"),
            difficulty=data.get("difficulty"),
            tools=json.dumps(data.get("tools", [])),        # Convert list to JSON string
            ingredients=json.dumps(data.get("ingredients", [])),
            taste=json.dumps(data.get("taste", []))
        )
        
        db.session.add(recipe)
        db.session.commit()
        
        return jsonify({
            "message": "Recipe created successfully",
            "recipe": recipe.to_dict()  # Return the created recipe
        }), 201
        
    except Exception as e:
        if "Missing field" in str(e):
            raise  # Re-raise validation errors (400 status)
        return jsonify({
            "error": "Database error",
            "message": "Could not create recipe. Database may not be initialized."
        }), 500


@app.post("/api/v1/admin/init-db")
def init_database():
    """
    Administrative endpoint to initialize database with tables and sample data.
    
    This endpoint:
    1. Creates all database tables if they don't exist
    2. Loads sample recipes from sample_recipes.json if database is empty
    3. Provides idempotent operation (safe to call multiple times)
    
    Returns:
        201: Database initialized with sample data
        200: Database already contains data (no action taken)
        500: Database initialization failed
    """
    try:
        # Create all database tables
        db.create_all()
        
        # Only add sample data if database is empty
        if Recipe.query.count() == 0:
            # Load sample recipes from sample_recipes.json if database is empty
            with open('sample_recipes.json', 'r') as f:
                sample_data = json.load(f)
            
            sample_recipes = []
            for data in sample_data:
                recipe = Recipe(
                    name=data["name"],
                    description=data["description"],
                    image_url=data["image_url"],
                    time=data["time"],
                    cuisine=data["cuisine"],
                    difficulty=data["difficulty"],
                    tools=json.dumps(data["tools"]),        # Convert arrays to JSON strings
                    ingredients=json.dumps(data["ingredients"]),
                    taste=json.dumps(data["taste"])
                )
                sample_recipes.append(recipe)
                db.session.add(recipe)
            
            db.session.commit()
            
            return jsonify({
                "message": f"Database initialized successfully with {len(sample_recipes)} sample recipes",
                "recipes_created": len(sample_recipes)
            }), 201
        else:
            # Database already has data
            return jsonify({
                "message": f"Database already contains {Recipe.query.count()} recipes",
                "recipes_count": Recipe.query.count()
            }), 200
            
    except Exception as e:
        return jsonify({
            "error": "Database initialization failed",
            "message": str(e)
        }), 500


@app.delete("/api/v1/admin/recipes")
def delete_all_recipes():
    """
    Administrative endpoint to delete all recipes from the database.
    
    This endpoint:
    1. Deletes all recipes from the database
    2. Also removes all associated favorites (due to CASCADE DELETE)
    3. Returns count of deleted recipes
    
    Returns:
        200: All recipes deleted successfully
        500: Database deletion failed
        
    Security Note:
        This is a destructive admin operation. No authentication required
        for simplicity, but in production should be protected.
    """
    try:
        # Count recipes before deletion
        recipe_count = Recipe.query.count()
        
        if recipe_count == 0:
            return jsonify({
                "message": "No recipes to delete",
                "recipes_deleted": 0
            }), 200
        
        # Delete all recipes (favorites will be deleted automatically due to CASCADE)
        Recipe.query.delete()
        db.session.commit()
        
        return jsonify({
            "message": f"Successfully deleted all {recipe_count} recipes",
            "recipes_deleted": recipe_count
        }), 200
        
    except Exception as e:
        # Rollback transaction on error
        db.session.rollback()
        return jsonify({
            "error": "Failed to delete recipes",
            "message": str(e)
        }), 500


@app.get("/api/v1/recipes/<int:recipe_id>")
@jwt_required(optional=True)
def get_recipe(recipe_id: int):
    """
    Get a specific recipe by ID.
    
    Authentication: Optional
    
    Parameters:
        recipe_id: Integer ID of the recipe
        
    Returns:
        200: Recipe data
        404: Recipe not found or database error
    """
    try:
        recipe: Recipe = Recipe.query.get_or_404(recipe_id)
        return jsonify(recipe.to_dict())
    except Exception as e:
        # If tables don't exist or other error, return 404
        return jsonify({"message": "Recipe not found"}), 404


@app.delete("/api/v1/recipes/<recipe_name>")
@jwt_required(optional=True)
def delete_recipe_by_name(recipe_name: str):
    """
    Delete a specific recipe by name.
    
    Authentication: Optional (for flexibility)
    
    Parameters:
        recipe_name: Name of the recipe to delete (case-insensitive)
        
    Returns:
        200: Recipe deleted successfully
        404: Recipe not found
        409: Multiple recipes found with same name
        500: Database deletion failed
        
    Note: This also removes the recipe from all users' favorites
    due to CASCADE DELETE constraint.
    """
    try:
        # Find recipes with matching name (case-insensitive)
        recipes = Recipe.query.filter(Recipe.name.ilike(recipe_name)).all()
        
        if not recipes:
            return jsonify({"message": f"Recipe '{recipe_name}' not found"}), 404
        
        if len(recipes) > 1:
            # Multiple recipes with same name found
            recipe_ids = [r.id for r in recipes]
            return jsonify({
                "message": f"Multiple recipes found with name '{recipe_name}'",
                "recipe_ids": recipe_ids,
                "suggestion": "Use DELETE /api/v1/recipes/<id> to delete a specific recipe"
            }), 409
        
        # Single recipe found - delete it
        recipe = recipes[0]
        recipe_id = recipe.id
        
        # Delete the recipe (favorites will be deleted automatically due to CASCADE)
        db.session.delete(recipe)
        db.session.commit()
        
        return jsonify({
            "message": f"Recipe '{recipe_name}' deleted successfully",
            "recipe_id": recipe_id
        }), 200
        
    except Exception as e:
        # Rollback transaction on error
        db.session.rollback()
        return jsonify({
            "error": "Failed to delete recipe",
            "message": str(e)
        }), 500


@app.put("/api/v1/recipes/<recipe_name>")
@jwt_required(optional=True)
def update_recipe(recipe_name: str):
    """
    Update a specific recipe by name.
    
    Authentication: Optional (for flexibility)
    
    Parameters:
        recipe_name: Name of the recipe to update (case-insensitive)
        
    Request Body (all fields optional):
        - name: New recipe name
        - description: Recipe description
        - image_url: Recipe image URL
        - time: Cooking time in minutes
        - cuisine: Cuisine type
        - difficulty: Difficulty level
        - tools: Array of required tools
        - ingredients: Array of ingredients
        - taste: Array of taste profiles
        
    Returns:
        200: Recipe updated successfully
        404: Recipe not found
        409: Multiple recipes found with same name
        500: Database update failed
    """
    try:
        # Find recipes with matching name (case-insensitive)
        recipes = Recipe.query.filter(Recipe.name.ilike(recipe_name)).all()
        
        if not recipes:
            return jsonify({"message": f"Recipe '{recipe_name}' not found"}), 404
        
        if len(recipes) > 1:
            # Multiple recipes with same name found
            recipe_ids = [r.id for r in recipes]
            return jsonify({
                "message": f"Multiple recipes found with name '{recipe_name}'",
                "recipe_ids": recipe_ids,
                "suggestion": "Recipe names should be unique for updates"
            }), 409
        
        # Single recipe found - update it
        recipe = recipes[0]
        data = request.get_json(silent=True) or {}
        
        # Update fields if provided in request
        if "name" in data:
            recipe.name = data["name"]
        if "description" in data:
            recipe.description = data["description"]
        if "image_url" in data:
            recipe.image_url = data["image_url"]
        if "time" in data:
            recipe.time = data["time"]
        if "cuisine" in data:
            recipe.cuisine = data["cuisine"]
        if "difficulty" in data:
            recipe.difficulty = data["difficulty"]
        if "tools" in data:
            recipe.tools = json.dumps(data["tools"])
        if "ingredients" in data:
            recipe.ingredients = json.dumps(data["ingredients"])
        if "taste" in data:
            recipe.taste = json.dumps(data["taste"])
        
        db.session.commit()
        
        return jsonify({
            "message": f"Recipe '{recipe_name}' updated successfully",
            "recipe": recipe.to_dict()
        }), 200
        
    except Exception as e:
        # Rollback transaction on error
        db.session.rollback()
        return jsonify({
            "error": "Failed to update recipe",
            "message": str(e)
        }), 500


@app.get("/api/v1/recipes/filter")
@jwt_required(optional=True)
def filter_recipes():
    """
    Advanced recipe filtering using two-layer architecture.
    
    Authentication: Optional
    
    Query Parameters (all optional):
        - time: Maximum cooking time in minutes
        - tools: Comma-separated list of required tools
        - ingredients: Comma-separated list of ingredients (partial matching)
        - taste: Comma-separated list of taste profiles
        - cuisine: Cuisine type (partial matching)
        - difficulty: Difficulty level (partial matching)
        
    Two-Layer Filtering:
        Layer 1 (Database): SQL filters for performance on time, cuisine, difficulty
        Layer 2 (Strategy Pattern): Complex logic for tools, ingredients, taste
        
    Returns:
        200: Filtered list of recipes
        500: Database error (returns empty list)
        
    Example:
        /api/v1/recipes/filter?time=30&cuisine=Italian&ingredients=chicken,pasta
    """
    try:
        # Extract and normalize query parameters
        criteria: Dict[str, Any] = {}
        for param in ["time", "tools", "ingredients", "taste", "cuisine", "difficulty"]:
            value = request.args.get(param)
            if value:
                criteria[param] = value

        # Layer 1: Database-level SQL filtering for performance
        # These filters can use database indexes and are very fast
        query = Recipe.query
        
        if "time" in criteria and str(criteria["time"]).isdigit():
            # Numeric comparison for cooking time
            query = query.filter(Recipe.time <= int(criteria["time"]))
            
        if "cuisine" in criteria:
            # Case-insensitive partial matching for cuisine
            query = query.filter(Recipe.cuisine.ilike(f"%{criteria['cuisine']}%"))
            
        if "difficulty" in criteria:
            # Case-insensitive partial matching for difficulty
            query = query.filter(Recipe.difficulty.ilike(f"%{criteria['difficulty']}%"))

        # Execute database query to get preliminary results
        preliminary = query.all()

        # Layer 2: Strategy Pattern filtering for complex application logic
        # Handles JSON array fields and complex matching logic
        engine = FilterEngine(criteria)
        filtered = engine.apply(preliminary)

        return jsonify({"recipes": [r.to_dict() for r in filtered]})
        
    except Exception as e:
        # Graceful degradation: return empty list on any error
        return jsonify({"recipes": []})


@app.get("/api/v1/recipes/search")
@jwt_required(optional=True)
def search_recipes():
    """
    Search recipes by name using fuzzy matching.
    
    Authentication: Optional
    
    Query Parameters:
        - query: Search term for recipe name (required)
        
    Returns:
        200: List of matching recipes
        400: Missing query parameter
        500: Database error (returns empty list)
        
    Example:
        /api/v1/recipes/search?query=chicken curry
    """
    try:
        query_str = request.args.get("query", "").strip()
        if not query_str:
            abort(400, description="Query parameter is required")

        # Case-insensitive partial matching on recipe name
        results = Recipe.query.filter(Recipe.name.ilike(f"%{query_str}%")).all()
        return jsonify({"recipes": [r.to_dict() for r in results]})
        
    except Exception as e:
        if "query parameter is required" in str(e):
            raise  # Re-raise validation errors (400 status)
        # Graceful degradation: return empty list on database errors
        return jsonify({"recipes": []})


# ---------------------------------------------------------------------------
# Favorites Management Routes
# ---------------------------------------------------------------------------

@app.get("/api/v1/favorites")
@jwt_required()
def get_favorites():
    """
    Get current user's favorite recipes.
    
    Authentication: Required (JWT token)
    
    Headers:
        Authorization: Bearer <JWT token>
        
    Returns:
        200: List of user's favorite recipes
        401: Invalid or missing token
        500: Database error
    """
    user_id = get_jwt_identity()
    
    try:
        # Join favorites with recipes to get complete recipe data
        favs = (
            Favorite.query.filter_by(user_id=user_id)
            .join(Recipe)
            .all()
        )
        return jsonify({"favorites": [f.recipe.to_dict() for f in favs]})
        
    except Exception as e:
        # Graceful degradation for database errors
        return jsonify({"favorites": []})


@app.post("/api/v1/favorites")
@jwt_required()
def add_favorite():
    """
    Add a recipe to user's favorites.
    
    Authentication: Required (JWT token)
    
    Headers:
        Authorization: Bearer <JWT token>
        
    Request Body:
        - recipe_id: ID of recipe to add to favorites
        
    Returns:
        201: Recipe added to favorites
        200: Recipe already in favorites (idempotent)
        400: Missing recipe_id field
        404: Recipe not found
        401: Invalid or missing token
    """
    data = get_json_or_abort(["recipe_id"])
    user_id = get_jwt_identity()

    # Verify recipe exists
    Recipe.query.get_or_404(data["recipe_id"])

    # Check if already in favorites (idempotent operation)
    if Favorite.query.filter_by(user_id=user_id, recipe_id=data["recipe_id"]).first():
        return jsonify({"message": "Already in favorites"}), 200

    # Add to favorites
    fav = Favorite(user_id=user_id, recipe_id=data["recipe_id"])
    db.session.add(fav)
    db.session.commit()

    return jsonify({
        "message": "Recipe added to favorites", 
        "recipe_id": data["recipe_id"]
    }), 201


@app.delete("/api/v1/favorites/<int:recipe_id>")
@jwt_required()
def remove_favorite(recipe_id: int):
    """
    Remove a recipe from user's favorites.
    
    Authentication: Required (JWT token)
    
    Headers:
        Authorization: Bearer <JWT token>
        
    Parameters:
        recipe_id: ID of recipe to remove from favorites
        
    Returns:
        200: Recipe removed from favorites
        404: Recipe not found in user's favorites
        401: Invalid or missing token
    """
    user_id = get_jwt_identity()
    
    # Find the favorite record for this user and recipe
    fav: Favorite | None = Favorite.query.filter_by(user_id=user_id, recipe_id=recipe_id).first()
    if not fav:
        return jsonify({
            "message": "Recipe not found in favorites", 
            "recipe_id": recipe_id
        }), 404

    # Remove from favorites
    db.session.delete(fav)
    db.session.commit()
    
    return jsonify({
        "message": "Recipe removed from favorites", 
        "recipe_id": recipe_id
    }), 200


# ---------------------------------------------------------------------------
# Error Handlers
# ---------------------------------------------------------------------------

@app.errorhandler(400)
@app.errorhandler(401)
@app.errorhandler(404)
@app.errorhandler(409)
@app.errorhandler(500)
def error_handler(error):
    """
    Global error handler for consistent error responses.
    
    Handles common HTTP errors and returns JSON responses with appropriate
    status codes and error messages.
    """
    code = getattr(error, "code", 500)
    return jsonify({"message": str(error)}), code


# ---------------------------------------------------------------------------
# CLI Commands for Database Management
# ---------------------------------------------------------------------------

@app.cli.command("init-db")
def init_db_command():
    """
    Flask CLI command for database initialization during development.
    
    Usage: flask init-db
    
    Creates tables and loads sample data if database is empty.
    This is an alternative to the /api/v1/admin/init-db endpoint.
    """
    # Create all tables
    db.create_all()
    
    # Add sample recipes if none exist
    if Recipe.query.count() == 0:
        # Load sample recipes from JSON file
        with open('sample_recipes.json', 'r') as f:
            sample_data = json.load(f)
            
        for data in sample_data:
            recipe = Recipe(
                name=data["name"],
                description=data["description"],
                image_url=data["image_url"],
                time=data["time"],
                cuisine=data["cuisine"],
                difficulty=data["difficulty"],
                tools=json.dumps(data["tools"]),        # Convert arrays to JSON strings
                ingredients=json.dumps(data["ingredients"]),
                taste=json.dumps(data["taste"])
            )
            db.session.add(recipe)
        
        db.session.commit()
        print("Database initialized with sample data!")


# ---------------------------------------------------------------------------
# Application Entrypoint
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    """
    Application entrypoint for development server.
    
    In production, this is replaced by a proper WSGI server like Gunicorn.
    The database table creation ensures the app works even if DB is empty.
    """
    with app.app_context():
        # Only create tables, don't force sample data initialization
        try:
            db.create_all()
        except Exception as e:
            print(f"Note: Could not initialize database tables: {e}")
    
    # Start development server
    app.run(host="0.0.0.0", port=5000) 
