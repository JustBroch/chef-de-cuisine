# Chef de Cuisine

A modern recipe discovery and management platform built with React and Flask. Find, filter, and save your favorite recipes with an intuitive and responsive interface.

## Features

### Advanced Recipe Search & Filtering
- **Dynamic Ingredient Selection**: Facebook Marketplace-style ingredient picker with search and custom input
- **Multi-criteria Filtering**: Filter by cooking time, cuisine, taste profile, and ingredients
- **Real-time Search**: Instant recipe search with partial matching
- **URL Persistence**: Bookmarkable filter states and search results

### 👤 User Management
- **JWT Authentication**: Secure login and registration system
- **User Profiles**: Personal dashboard with user information
- **Favorites System**: Save and manage favorite recipes
- **Protected Routes**: Secure access to user-specific features

### 📱 Responsive Design
- **Mobile-First**: Optimized for all device sizes
- **Modern UI**: Clean, intuitive interface with smooth animations
- **Accessibility**: ARIA support and keyboard navigation
- **Touch-Friendly**: Optimized for mobile interactions

### Design System
- **Consistent Theming**: Orange/amber gradient color scheme
- **Component Library**: Reusable UI components with Tailwind CSS
- **Typography**: Responsive text sizing and proper contrast ratios
- **Interactive Elements**: Hover effects and loading states

## Architecture

### Single DNS Endpoint with Path-Based Routing

The application uses a **single Application Load Balancer** with intelligent path-based routing:

**Frontend Service (nginx + React):**
- Routes: `/`, `/recipes`, `/login`, `/about`, `/assets/*`
- Serves: Production React build, static assets, SPA routing
- Server: nginx (visible in response headers)

**Backend Service (Flask API):**
- Routes: `/api/v1/*` (all API endpoints)
- Serves: JSON API responses, authentication, database operations  
- Server: Werkzeug/Flask (visible in response headers)

**Benefits:**
- ✅ **No CORS Issues**: Frontend and API share same domain
- ✅ **Cost Effective**: Single load balancer vs separate ALBs
- ✅ **Simple Client Config**: One base URL for entire application
- ✅ **Industry Standard**: Used by Netflix, Airbnb, GitHub, etc.
- ✅ **Independent Scaling**: Each service scales independently

### Example Usage

```bash
# Frontend routes (HTML responses)
curl http://your-app.com/                    # React app
curl http://your-app.com/recipes             # React router handles
curl http://your-app.com/login               # React router handles

# Backend routes (JSON responses)  
curl http://your-app.com/api/v1/recipes      # Flask API
curl http://your-app.com/api/v1/auth/login   # Flask API
curl http://your-app.com/api/v1/favorites    # Flask API
```

## Technology Stack

### Frontend
- **React 19.1.0** with TypeScript
- **React Router 7.6.0** for navigation
- **Tailwind CSS 4.1.6** for styling
- **Vite** for build tooling
- **React Hook Form** for form handling
- **Lucide React** for icons

### Backend
- **Flask** with Python
- **SQLAlchemy** ORM
- **PostgreSQL/SQLite** database
- **JWT** authentication
- **Strategy Pattern** for filtering

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Docker and Docker Compose (recommended for backend)
- Python 3.8+ (only if running backend without Docker)

### Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint
```

### Local Development Setup (Docker - Recommended)

```bash
# Build everything first (recommended)
./deploy.sh build

# Start all services
./deploy.sh start
```

**Available Commands:**
- `./deploy.sh build` - Install dependencies and build images (no hosting)
- `./deploy.sh start` - Clear ports, build if needed, and start all services 
- `./deploy.sh stop` - Stop services but preserve build artifacts
- `./deploy.sh clean` - Remove all images and dependencies
- `./deploy.sh status` - Show service status and URLs

### Alternative: Manual Backend Setup (Without Docker)

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Set environment variables
export DATABASE_URL="sqlite:///local.db"
export JWT_SECRET_KEY="local-development-secret"

# Initialize database
python app.py

# Start Flask server
flask run
```

## Deployment

### Local Development with Docker (Recommended)

**Quick Start:**
```bash
# Build everything first
./deploy.sh build

# Start all services 
./deploy.sh start
```

**Build Command:**
- Pulls PostgreSQL Docker image
- Builds Flask backend Docker image
- Builds React frontend Docker image (for cloud deployment)
- Installs frontend npm dependencies (for local development)
- Prepares everything for deployment (no hosting)

**Start Command:** 
- Clears any conflicting ports
- Builds if not already built
- Starts PostgreSQL database container
- Starts Flask backend API container
- Starts Vite frontend development server

**Access your application:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5174

### AWS Production Deployment

**Prerequisites:**
- AWS CLI configured with appropriate permissions
- Terraform installed (>= 1.3.0)
- Docker installed for image building

**Steps:**
1. **Configure AWS Credentials:**
  ```bash
  # Edit the credentials file with your AWS profile
  vim credentials
  ```

2. **Deploy Infrastructure:**
  ```bash
 ./deploy.sh cloud
  ```
  This script will:
  - Initialize Terraform
  - Build and push frontend Docker image to ECR
  - Build and push backend Docker image to ECR
  - Deploy dual ECS services with Application Load Balancer
  - Set up RDS PostgreSQL database
  - Configure auto-scaling policies for both services
  - Output the application URL

3. **Access Your Application:**
  - The script outputs the load balancer DNS name
  - Single endpoint for entire application: `http://<load-balancer-dns>`
  - Frontend pages: `http://<load-balancer-dns>/`, `/recipes`, `/login`
  - Backend API: `http://<load-balancer-dns>/api/v1/*`
  - No CORS issues - same domain for frontend and API

**AWS Architecture:**
- **Single Application Load Balancer**: Path-based routing with one DNS endpoint
  - Frontend routes: `/`, `/recipes`, `/login` etc. → nginx service
  - Backend routes: `/api/*` → Flask service
- **ECS Fargate**: Two independent serverless container services
  - Frontend service: nginx + React (production build)
  - Backend service: Flask + SQLAlchemy
- **ECR Repositories**: Separate container registries for frontend and backend
- **RDS PostgreSQL**: Managed database service with automatic backups
- **Auto Scaling**: Independent CPU-based scaling policies (2-5 instances each)
- **CloudWatch**: Comprehensive logging and monitoring

### Environment Variables

**Local Development:**
```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/chefdecuisine
JWT_SECRET_KEY=local-development-secret-key
FLASK_ENV=development
```

**Production:**
```bash
DATABASE_URL=<RDS_CONNECTION_STRING>
JWT_SECRET_KEY=<SECURE_RANDOM_KEY>
DB_HOST=<RDS_ENDPOINT>
DB_USER=postgres
DB_PASSWORD=<AUTO_GENERATED>
DB_NAME=chefdecuisine
```

## Testing

### Running Tests

**Backend Tests:**
```bash
cd backend
python -m pytest test/ -v
```

**Backend Tests (Manual):**
```bash
cd backend
export DATABASE_URL="sqlite:///test.db"
export JWT_SECRET_KEY="test-secret-key"
python -m pytest test/ -v
```

**Frontend Tests:**
```bash
npm run testclient  # Run frontend unit tests with Vitest
```

### Test Structure

```
├── backend/test/      # Backend test suite
│  ├── test_auth.py    # Authentication endpoint tests
│  ├── test_recipes.py  # Recipe CRUD and filtering tests
│  ├── test_favorites.py # Favorites management tests
│  └── conftest.py    # Test configuration and fixtures
├── src/components/clienttests/ # Frontend component tests

```

### Test Coverage

**Backend Tests Include:**
- Authentication flow (register, login, JWT validation)
- Recipe CRUD operations
- Advanced filtering with Strategy Pattern
- Favorites management
- Error handling and edge cases
- Database relationships and constraints

**Frontend Tests Include:**
- Component rendering and props
- User interactions and form submissions
- Routing and navigation
- API integration mocking
- Responsive design validation

### Interpreting Test Results

**Successful Tests:**
```bash
✓ test_user_registration - User can register with valid data
✓ test_recipe_filtering - Strategy pattern filters work correctly
✓ test_favorites_management - Users can add/remove favorites
```

**Failed Tests:**
```bash
✗ test_invalid_login - Expected 401, got 500
 AssertionError: Login should reject invalid credentials
```

**Test Commands:**
```bash
cd backend && python -m pytest test/ -v # Run backend tests
npm run testclient            # Run frontend tests
```

## Project Structure

```
├── src/
│  ├── components/
│  │  ├── pages/      # Page components
│  │  ├── ui/       # Reusable UI components
│  │  ├── layouts/     # Layout wrappers
│  │  ├── clienttests/ # Frontend testing suite
│  │  ├── DynamicIngredients.tsx
│  │  ├── SearchForm.tsx
│  │  ├── navbar.tsx
│  │  └── footer.tsx
│  ├── lib/         # Utility functions
│  ├── assets/       # Static assets
│  └── App.tsx
├── backend/         # Flask API
│  ├── test/        # Backend testing suite
│  └── Dockerfile    # Backend container configuration
├── public/         # Public assets
├── Dockerfile.frontend # Frontend container configuration
├── nginx.conf       # Nginx configuration for frontend
├── deploy.sh        # Unified deployment script
├── main.tf         # Terraform infrastructure
├── credentials      # AWS credentials file
├── docs/           # Comprehensive documentation
└── README.md
```

## Key Components

### Dynamic Ingredients System
Advanced ingredient selection with:
- Tag-based display with hover-to-remove
- Searchable dropdown with filtering
- Custom ingredient input capability
- Form integration with hidden inputs

### Advanced Filtering
Multi-layer filtering system:
- **Database Level**: Fast SQL queries for time, cuisine, difficulty
- **Application Level**: Complex JSON filtering for ingredients, tools, taste
- **Strategy Pattern**: Extensible filter architecture

### Authentication Flow
- JWT-based authentication
- Persistent login state
- Protected route handling
- User profile management

## API Integration

The frontend integrates with a Flask backend API:

- `GET /api/v1/recipes` - Recipe listing
- `GET /api/v1/recipes/filter` - Advanced filtering
- `GET /api/v1/recipes/search` - Text search
- `POST /api/v1/auth/login` - User authentication
- `POST /api/v1/auth/register` - User registration
- `GET /api/v1/favorites` - User favorites

## Development

### Code Quality
- **TypeScript**: Strict type checking
- **ESLint**: Code style enforcement
- **React Hooks**: Modern React patterns
- **Responsive Design**: Mobile-first approach

### Performance
- **Code Splitting**: Route-based lazy loading
- **Image Optimization**: Responsive images with lazy loading
- **Bundle Optimization**: Tree shaking and minification

### Accessibility
- **ARIA Support**: Screen reader compatibility
- **Keyboard Navigation**: Full keyboard accessibility
- **High Contrast**: Color-blind friendly design
- **Semantic HTML**: Proper HTML structure



## Testing and Verification

### Command Testing Results

All deploy.sh commands have been thoroughly tested and verified:

#### Local Development Commands

**`./deploy.sh build`**
- Pulls PostgreSQL 15-alpine image
- Builds custom backend Docker image 
- Installs npm dependencies
- Validation: Images and dependencies ready for deployment

**`./deploy.sh start`** 
- Auto-detects missing images and rebuilds automatically
- Port clearing (5174, 5173, 5432) with enhanced feedback
- Database container starts successfully
- Backend API starts and responds on port 5174
- Frontend development server launches on port 5173
- Auto-build integration works seamlessly

**`./deploy.sh stop`**
- Gracefully stops all Docker containers
- Clears all used ports
- Preserves build artifacts for quick restart
- Clean shutdown of all services

**`./deploy.sh clean`**
- Stops all services first
- Removes all Docker images (backend + PostgreSQL)
- Deletes node_modules and package-lock.json
- Complete system cleanup for fresh start

**`./deploy.sh status`**
- Shows real-time service status (Running/Stopped)
- Displays service URLs with correct ports
- Reports build status of images and dependencies
- Clear, color-coded status information

#### Cloud Deployment Commands

**`./deploy.sh cloud`**
- Terraform validation and initialization
- Enhanced deployment logging with progress indicators
- Docker image building and ECR push
- ECS service deployment with rolling updates
- Load balancer DNS retrieval and display
- Detailed deployment summary with all URLs
- **Successfully deployed to:** http://chefdeCuisine-alb-1272383064.us-east-1.elb.amazonaws.com

### Backend API Verification

Comprehensive API testing with multiple approaches:

**Health Check**
```
GET http://localhost:5174/
Status: 200 OK
Response: {"message":"Chef de Cuisine API is running","status":"healthy"}
```

**Database Initialization**
```
POST http://localhost:5174/api/v1/admin/init-db
Status: 201 CREATED 
Response: {"message":"Database initialized successfully with 8 sample recipes","recipes_created":8}
```

**Recipe API**
```
GET http://localhost:5174/api/v1/recipes
Status: 200 OK
Response: {"recipes":[...]} (8 recipes returned)
```

### Port Configuration

**Updated Port Assignments:**
- Database: `5432` (PostgreSQL)
- Backend API: `5174` (avoid macOS ControlCenter conflict)
- Frontend: `5173` (Vite development server)

**Port Clearing Enhancement:**
- Intelligent process detection with feedback
- Graceful termination with wait periods
- Clear reporting of which ports were cleared

### Development Workflow Validation

**Recommended Workflow:**
```bash
# Fresh start
./deploy.sh clean  # Clear everything
./deploy.sh build  # Build all components 
./deploy.sh start  # Start all services

# Development cycle 
./deploy.sh stop   # Stop when done
./deploy.sh start  # Quick restart (no rebuild)

# Cloud deployment
./deploy.sh cloud  # Deploy to AWS production
```

**Auto-Build Integration:**
- `start` command detects missing images
- Automatically triggers build when needed
- No manual intervention required
- Seamless development experience

### Error Handling & Validation

**Docker Validation:**
- Checks Docker daemon status before operations
- Clear error messages with instructions
- Graceful failure handling

**Terraform Validation:**
- Verifies Terraform installation for cloud commands
- AWS credential validation with helpful error messages
- Comprehensive deployment logging

**Port Conflict Resolution:**
- Automatic port clearing before service start
- Process detection and graceful termination
- Wait periods for complete port release

### System Integration

**Frontend ↔ Backend:**
- Backend API fully functional on port 5174
- Database connectivity verified
- Recipe data loading and retrieval working
- All API endpoints responding correctly

**Local ↔ Cloud:**
- Same Docker images used for local and production
- Environment-specific configuration handling
- Seamless transition from local to cloud deployment

**Development Tools:**
- Vitest integration for automated testing
- Real-time service monitoring with status command
- Color-coded output for better user experience

### Performance & Reliability

**Local Development:**
- Fast container startup and shutdown
- Efficient image building with layer caching
- Minimal resource usage with focused containers

**Cloud Deployment:**
- ECS Fargate serverless scaling
- Application Load Balancer traffic distribution
- RDS PostgreSQL managed database
- Rolling deployment strategy for zero downtime

### Testing Framework Details

For comprehensive testing documentation, see:

- **[Frontend Testing](docs/development/frontend.md#testing)** - Vitest + React Testing Library for component and API integration tests
- **[Backend Testing](docs/development/backend.md#testing)** - K6 load testing for performance and API validation

**Frontend Testing:**
- Component unit tests with React Testing Library
- API integration tests with real endpoints
- User interaction testing with realistic scenarios
- Accessibility and routing testing

**Backend Testing:**
- K6 load testing with realistic user flows
- Performance metrics and stress testing
- Authentication and API endpoint validation
- Continuous integration testing support

This comprehensive testing confirms that the deployment system is production-ready and provides a seamless developer experience from local development to cloud deployment.

## Documentation

- **[Frontend Documentation](docs/development/frontend.md)** - Detailed frontend architecture, components, and local deployment
- **[Backend Documentation](docs/development/backend.md)** - API endpoints, database design, and deployment architecture 
- **[API Documentation](https://docs.google.com/document/d/1DpVdCM-CT8sn_lA9-FbAUW-qNMebTVoB-v-XUkf2tQ8/edit?tab=t.z71dgwx0fmq0)** - Complete API reference

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is part of the CSSE6400 course at the University of Queensland.

---

Built by the Chef de Cuisine team
