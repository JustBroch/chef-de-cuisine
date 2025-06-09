# Chef de Cuisine Frontend Documentation

## Overview

The Chef de Cuisine frontend is a modern React application built with TypeScript, featuring a responsive design, dynamic ingredient filtering, and seamless user experience. It uses React Router for navigation and integrates with the Flask backend API.

### Deployment Architecture

The frontend runs as an independent ECS Fargate service behind an Application Load Balancer with **path-based routing**:

**Production Access:**
- **Base URL**: `http://<load-balancer-dns>/`
- **Routing Rule**: All non-`/api/*` requests → nginx frontend service
- **Service Independence**: Scales separately from backend (2-5 instances)
- **Container**: nginx serving production React build

**Local Development:**
- **Base URL**: `http://localhost:5173/`
- **Direct Access**: Vite development server on port 5173

**Routes Handled by Frontend:**
- `/` - Home page
- `/recipes` - Recipe browsing
- `/login` - Authentication  
- `/register` - User registration
- `/profile` - User profile
- `/assets/*` - Static files (JS, CSS, images)

**Key Benefits:**
- ✅ **SPA Routing**: nginx handles React Router properly
- ✅ **Static Asset Optimization**: Efficient serving of built assets
- ✅ **Same Domain**: API calls to `/api/*` work without CORS

## Technology Stack

- **React 19.1.0** - Core framework
- **TypeScript** - Type safety and development experience
- **React Router 7.6.0** - Client-side routing
- **Tailwind CSS 4.1.6** - Utility-first styling
- **Vite** - Build tool and development server
- **Lucide React** - Icon library
- **React Hook Form** - Form handling and validation
- **Axios** - HTTP client for API requests

## Architecture

### Component Structure

```
src/
├── components/
│  ├── layouts/
│  │  └── SearchLayout.tsx   # Layout wrapper for search pages
│  ├── pages/
│  │  ├── HomePage.tsx     # Landing page
│  │  ├── SearchPage.tsx    # Search results display
│  │  ├── FilterPage.tsx    # Advanced filtering interface
│  │  ├── RecipePage.tsx    # Individual recipe details
│  │  ├── LoginPage.tsx     # User authentication
│  │  ├── RegistrationPage.tsx # User registration
│  │  ├── UserProfilePage.tsx  # User profile and favorites
│  │  ├── AuthenticatedPage.tsx # Protected route example
│  │  ├── ErrorPage.tsx     # Error handling
│  │  └── ValidationError.tsx  # Form validation display
│  ├── ui/
│  │  ├── button.tsx      # Reusable button component
│  │  ├── navigation-menu.tsx # Navigation menu components
│  │  └── sheet.tsx      # Mobile menu sheet
│  ├── DynamicIngredients.tsx  # Dynamic ingredient selector
│  ├── SearchForm.tsx      # Search input component
│  ├── navbar.tsx        # Main navigation
│  ├── footer.tsx        # Site footer
│  ├── Routes.tsx        # Route configuration
│  └── types.tsx        # TypeScript type definitions
├── assets/
│  └── logo.png         # Application logo
├── lib/
│  ├── timeUtils.ts      # Time formatting utilities
│  ├── utils.ts        # Class name utilities (cn function)
│  ├── button-variants.ts   # Button styling variants
│  └── navigation-menu-styles.ts # Navigation menu styling
├── App.tsx           # Root component
├── App.css           # Global styles
├── index.css          # Tailwind imports
└── main.tsx           # Application entry point
```

## Key Features

### 1. Dynamic Ingredient System

The `DynamicIngredients` component provides a Facebook Marketplace-style ingredient selection:

**Features:**
- Tag-based ingredient display
- Searchable dropdown with filtering
- Custom ingredient input capability
- Hover-to-remove functionality
- Form integration with hidden inputs

**Implementation:**
```typescript
interface DynamicIngredientsProps {
 initialIngredients?: string[];
 onChange: (ingredients: string[]) => void;
}
```

### 2. Advanced Recipe Filtering

The `FilterPage` component offers comprehensive filtering options:

**Filter Types:**
- **Time**: Cooking duration (15 mins to 3+ hours)
- **Cuisine**: Italian, Chinese, French, etc.
- **Taste Profile**: Sweet, spicy, savory, etc.
- **Ingredients**: Dynamic multi-select with search

**URL Parameter Handling:**
- Filters persist in URL for bookmarking
- Real-time updates without page refresh
- Proper state synchronization

### 3. Responsive Design

**Desktop Features:**
- Full navigation menu
- Multi-column layouts
- Hover effects and animations
- Advanced search functionality

**Mobile Features:**
- Collapsible hamburger menu
- Touch-friendly interfaces
- Optimized card layouts
- Swipe-friendly interactions

### 4. Authentication System

**Login/Registration:**
- Form validation with React Hook Form
- JWT token management
- Persistent authentication state
- Protected route handling

**User Profile:**
- Personal information display
- Favorite recipes management
- Recipe card layout with images

## Component Details

### Navigation (navbar.tsx)

**Features:**
- Responsive design with mobile sheet menu
- Authentication state management
- Search form integration
- Logo and branding

**Authentication States:**
- Logged out: Login/Sign up buttons
- Logged in: Logout button and profile access

### Search System

**SearchForm Component:**
- Integrated search input with custom styling
- Focus management for better UX
- Clear button functionality
- Form submission handling

**SearchPage Component:**
- Results display with recipe cards
- Empty state handling
- Responsive grid layout
- Recipe preview with images and metadata

### Recipe Display

**Recipe Cards:**
- High-quality image display
- Recipe metadata (time, cuisine, difficulty)
- Hover effects and transitions
- Consistent styling across pages

**Recipe Details:**
- Full recipe information
- Ingredient lists
- Cooking instructions
- Nutritional information

### Form Handling

**Validation:**
- Real-time form validation
- Custom error messages
- Accessible error display
- Visual feedback for form states

**User Experience:**
- Auto-focus on form fields
- Loading states during submission
- Success/error feedback
- Form reset functionality

## Styling System

### Design Language

**Color Palette:**
- Primary: Orange to Amber gradient (`from-orange-500 to-amber-500`)
- Secondary: Pink accents for favorites
- Neutral: Gray scale for text and backgrounds
- Success: Green for positive actions
- Error: Red for validation and errors

**Typography:**
- Font weights: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)
- Responsive text sizing
- Consistent line heights
- Proper contrast ratios

**Layout Principles:**
- 8px grid system
- Consistent spacing with Tailwind utilities
- Responsive breakpoints (sm, md, lg, xl)
- Container max-widths for readability

### Component Styling

**Cards:**
- Rounded corners (`rounded-2xl`)
- Subtle shadows (`shadow-xl`)
- Border accents
- Hover state transitions

**Buttons:**
- Gradient backgrounds
- Consistent padding and sizing
- Icon integration
- Loading and disabled states

**Forms:**
- Clean input styling
- Focus states with ring effects
- Validation feedback
- Accessible labels and descriptions

## State Management

### Local State (useState)

**Component-level state:**
- Form inputs and validation
- UI state (dropdowns, modals)
- Loading and error states
- Search and filter parameters

### URL State (React Router)

**Persistent state in URL:**
- Search queries
- Filter parameters
- Page navigation
- Authentication redirects

### Local Storage

**Persistent data:**
- JWT authentication tokens
- User preferences
- Session management

## API Integration

### HTTP Client (Axios)

**Base Configuration:**
```typescript
const baseurl = "http://chefdecuisine-alb-1272383064.us-east-1.elb.amazonaws.com";
```

**Authentication:**
- JWT token in Authorization header
- Automatic token refresh handling
- Error handling for expired tokens

### Data Fetching

**React Router Loaders:**
- Server-side data fetching
- Loading states
- Error boundaries
- Type-safe data handling

**API Endpoints Used:**
- `/api/v1/recipes` - Recipe listing
- `/api/v1/recipes/filter` - Advanced filtering
- `/api/v1/recipes/search` - Text search
- `/api/v1/auth/login` - User authentication
- `/api/v1/auth/register` - User registration
- `/api/v1/favorites` - User favorites

## Performance Optimizations

### Code Splitting

- Route-based code splitting with React Router
- Lazy loading of components
- Dynamic imports for large dependencies

### Image Optimization

- Responsive image sizing
- Lazy loading for recipe images
- Optimized aspect ratios
- Fallback handling for missing images

### Bundle Optimization

- Tree shaking with Vite
- Minification and compression
- CSS purging with Tailwind
- Asset optimization

## Accessibility

### ARIA Support

- Proper semantic HTML
- ARIA labels and descriptions
- Role attributes for interactive elements
- Screen reader compatibility

### Keyboard Navigation

- Tab order management
- Focus indicators
- Keyboard shortcuts
- Skip links for navigation

### Visual Accessibility

- High contrast ratios
- Scalable text sizing
- Color-blind friendly palette
- Reduced motion support

## Development Workflow

### Build System (Vite)

**Development:**
```bash
npm run dev     # Start development server
npm run lint     # Run ESLint
npm run build    # Production build
npm run preview   # Preview production build
```

**Configuration:**
- TypeScript support
- Hot module replacement
- Path aliases (`@/` for `src/`)
- Tailwind CSS integration

### Code Quality

**ESLint Configuration:**
- TypeScript rules
- React hooks rules
- Import/export validation
- Code style enforcement

**TypeScript:**
- Strict type checking
- Interface definitions
- Type assertions for API data
- Generic type usage

## Deployment

### Local Development (Docker-Based)

The recommended local development setup uses the `deploy.sh` script for a streamlined experience:

#### Quick Start

```bash
# Build everything first (recommended)
./deploy.sh build

# Start all services
./deploy.sh start
```

**Development Lifecycle:**

**Build Phase (`./deploy.sh build`):**
1. **Docker Validation**: Checks if Docker is running
2. **Image Preparation**: Pulls PostgreSQL and builds Flask images
3. **Dependency Installation**: Runs `npm install --silent`
4. **No Service Start**: Builds everything without hosting

**Start Phase (`./deploy.sh start`):**
1. **Port Clearing**: Kills conflicting processes
2. **Auto-Build**: Builds if images/dependencies missing
3. **Database Setup**: Starts PostgreSQL container
4. **Backend Start**: Launches Flask API container
5. **Frontend Server**: Starts Vite development server

**Development Commands:**
- `./deploy.sh stop` - Stop services, keep build artifacts
- `./deploy.sh clean` - Remove all images and dependencies 
- `./deploy.sh status` - Check service and build status

**Services:**
- **Frontend**: http://localhost:5173 (Vite dev server)
- **Backend**: http://localhost:5174 (Flask API in Docker)
- **Database**: PostgreSQL in Docker container

**Benefits:**
- Consistent environment across machines
- No need to install PostgreSQL locally
- Backend runs in production-like container
- Fast frontend hot-reload with native Vite
- Single command setup

#### Manual Development Setup (Alternative)

```bash
# Frontend only (requires backend running separately)
npm install
npm run dev
```

**Development Commands:**
```bash
npm run dev     # Start Vite development server
npm run build    # Production build
npm run lint     # Run ESLint
npm run preview   # Preview production build
npm run testclient  # Run frontend tests
```

### Production Build Process

1. **Type Checking**: TypeScript compilation
2. **Linting**: ESLint validation 
3. **Dependency Resolution**: npm install optimization
4. **Vite Build**: Production bundling
5. **Asset Optimization**: Minification and compression
6. **Static File Generation**: HTML, CSS, JS bundles

### Build Configuration

**Vite Configuration (vite.config.ts):**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

export default defineConfig({
 plugins: [react(), tailwindcss()],
 resolve: {
  alias: {
   "@": path.resolve(__dirname, "./src"),
  },
 },
})
```

**Package.json Scripts:**
```json
{
 "scripts": {
  "dev": "vite",
  "build": "vite build", 
  "lint": "eslint.",
  "preview": "vite preview",
  "server": "json-server --watch db.json --port 3001",
  "testclient": "vitest"
 }
}
```

### Environment Configuration

**Development Environment:**
- **API Endpoint**: http://localhost:5174 (Docker container)
- **Hot Reload**: Enabled with Vite HMR
- **Source Maps**: Full source mapping for debugging
- **Error Overlay**: Development error display

**Production Settings:**
- **API Endpoint**: AWS Load Balancer URL
- **Asset Optimization**: Minified bundles
- **Code Splitting**: Route-based lazy loading
- **Error Handling**: Production error boundaries
- **Performance Monitoring**: Bundle analysis

### Local Development Architecture

```
┌─────────────────────┐
│  deploy.sh script │
└─────────┬───────────┘
     │
     ├─── Docker Desktop
     │  ├─── postgres:15-alpine (Database)
     │  └─── chefdecuisine-backend (Flask API)
     │
     └─── Native Node.js
        └─── Vite Dev Server (Frontend)
```

**Network Configuration:**
- Frontend connects to backend via http://localhost:5174
- Backend connects to database via Docker internal networking
- All services accessible from host machine

### Deployment Verification

**After running./deploy.sh:**
1. **Frontend Check**: Navigate to http://localhost:5173
2. **Backend Health**: Check http://localhost:5174
3. **Database Connection**: Backend logs should show successful DB connection
4. **API Integration**: Frontend should load recipes from backend

**Common Issues:**
- **Docker not running**: Error message with instructions
- **Port conflicts**: Kill processes using ports 5174, 5173, 5432
- **npm dependencies**: Delete node_modules and run./deploy.sh again

## Future Enhancements

### Planned Features

1. **Recipe Creation**: User-generated content
2. **Social Features**: Recipe sharing and comments
3. **Meal Planning**: Weekly meal planning tools
4. **Shopping Lists**: Automatic grocery list generation
5. **Offline Support**: PWA capabilities
6. **Advanced Search**: AI-powered recipe recommendations

### Technical Improvements

1. **State Management**: Redux or Zustand for complex state
2. **Performance**: Virtual scrolling for large lists
3. **Accessibility**: Enhanced screen reader support
4. **Internationalization**: Multi-language support

## Testing

### Frontend Testing Architecture

The application uses **Vitest** with React Testing Library for comprehensive frontend testing. Tests are organized into two main categories:

#### Test Structure
```
src/components/clienttests/
├── api/                          # API Integration Tests
│   ├── testRecipePageapi.test.tsx    # Recipe API endpoint testing
│   ├── testSearchapi.test.tsx        # Search API endpoint testing  
│   └── testTimeFilterapi.test.tsx    # Filter API endpoint testing
└── components/                   # Component Unit Tests
    ├── testHome.test.tsx             # Home page component testing
    ├── testRecipePage.test.tsx       # Recipe page component testing
    ├── testSearch.test.tsx           # Search component testing
    └── testTimeFilter.test.tsx       # Filter component testing
```

#### Running Tests

```bash
# Run all frontend tests
npm run testclient

# Run tests in watch mode
npm run testclient -- --watch

# Run specific test file
npm run testclient src/components/clienttests/api/testRecipePageapi.test.tsx

# Run tests with coverage
npm run testclient -- --coverage
```

#### Test Categories

**1. API Integration Tests (`src/components/clienttests/api/`)**
- Test real API endpoints with live data
- Validate API response handling and data fetching
- Use production/staging endpoints for realistic testing
- Verify component behavior with actual API responses

Example API integration test:
```typescript
/**
 * @vitest-environment jsdom
 */
import { createRoutesStub } from "react-router";
import { render, screen, waitFor } from "@testing-library/react";

test("recipe page loads real data", async () => {
  const baseurl = "http://chefdecuisine-alb-1272383064.us-east-1.elb.amazonaws.com";
  
  const Stub = createRoutesStub([{
    path: "/recipes/:id",
    Component: RecipePage,
    loader: async ({ params }) => {
      const response = await fetch(`${baseurl}/api/v1/recipes/${params.id}`);
      const recipe = await response.json();
      return { recipe };
    }
  }]);
  
  render(<Stub initialEntries={["/recipes/182"]} />);
  
  await waitFor(() => screen.findByText("Pasta Carbonara"), {
    timeout: 5000,
    interval: 100,
  });
});
```

**2. Component Unit Tests (`src/components/clienttests/components/`)**
- Test component rendering and behavior in isolation
- Validate user interactions and event handling
- Test routing and navigation without API calls
- Mock external dependencies for focused testing

Example component unit test:
```typescript
/**
 * @vitest-environment jsdom
 */
import { createRoutesStub } from "react-router";
import { render, screen, waitFor } from "@testing-library/react";

test("home page renders correctly", async () => {
  const Stub = createRoutesStub([{
    path: "/",
    Component: App,
    children: [{ index: true, Component: HomePage }]
  }]);
  
  render(<Stub initialEntries={["/"]} />);
  await waitFor(() => screen.findByText("Home"));
});
```

#### Testing Technologies

- **Vitest**: Modern test runner with native ESM and TypeScript support
- **React Testing Library**: Component testing with user-centric queries
- **@testing-library/user-event**: Realistic user interaction simulation
- **React Router Stubs**: Route testing without full router complexity
- **JSDOM Environment**: Browser-like DOM APIs in Node.js

#### Test Configuration

**Environment Setup:**
- Tests use `@vitest-environment jsdom` for DOM APIs
- TypeScript support with `tsx` file extensions
- Automatic mock resolution for external dependencies

**Test Patterns:**
- **Arrange-Act-Assert**: Clear test structure
- **User-Centric Testing**: Testing from user perspective
- **Async Testing**: Proper handling of async operations with `waitFor`
- **Route-Based Testing**: Testing components within routing context

#### Testing Best Practices

**Component Testing:**
- Test behavior, not implementation details
- Use semantic queries (`getByRole`, `getByText`)
- Test user interactions and expected outcomes
- Mock API calls for predictable unit tests

**API Integration Testing:**
- Use real endpoints for realistic testing
- Handle network timeouts and errors gracefully
- Test with actual data structures
- Verify loading states and error handling

**Accessibility Testing:**
- Test keyboard navigation
- Verify screen reader compatibility
- Check ARIA attributes and roles
- Test focus management

#### Continuous Integration

Tests run automatically on:
- Pull request creation
- Code commits to main branches
- Pre-deployment verification
- Local development with watch mode

**CI Configuration:**
```bash
# In CI pipeline
npm install
npm run testclient -- --run --coverage
npm run build  # Verify build after tests pass
``` 