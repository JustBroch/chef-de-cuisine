# Chef de Cuisine Frontend Documentation

## Overview

The Chef de Cuisine frontend is a modern React application built with TypeScript, featuring a responsive design, dynamic ingredient filtering, and seamless user experience. It uses React Router for navigation and integrates with the Flask backend API.

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
│   ├── layouts/
│   │   └── SearchLayout.tsx      # Layout wrapper for search pages
│   ├── pages/
│   │   ├── HomePage.tsx          # Landing page
│   │   ├── SearchPage.tsx        # Search results display
│   │   ├── FilterPage.tsx        # Advanced filtering interface
│   │   ├── RecipePage.tsx        # Individual recipe details
│   │   ├── LoginPage.tsx         # User authentication
│   │   ├── RegistrationPage.tsx  # User registration
│   │   ├── UserProfilePage.tsx   # User profile and favorites
│   │   ├── AuthenticatedPage.tsx # Protected route example
│   │   ├── ErrorPage.tsx         # Error handling
│   │   └── ValidationError.tsx   # Form validation display
│   ├── ui/
│   │   ├── button.tsx           # Reusable button component
│   │   ├── navigation-menu.tsx  # Navigation menu components
│   │   └── sheet.tsx           # Mobile menu sheet
│   ├── DynamicIngredients.tsx   # Dynamic ingredient selector
│   ├── SearchForm.tsx           # Search input component
│   ├── navbar.tsx               # Main navigation
│   ├── footer.tsx               # Site footer
│   ├── Routes.tsx               # Route configuration
│   └── types.tsx                # TypeScript type definitions
├── assets/
│   └── logo.png                 # Application logo
├── lib/
│   ├── timeUtils.ts            # Time formatting utilities
│   ├── utils.ts                # Class name utilities (cn function)
│   ├── button-variants.ts      # Button styling variants
│   └── navigation-menu-styles.ts # Navigation menu styling
├── App.tsx                      # Root component
├── App.css                      # Global styles
├── index.css                    # Tailwind imports
└── main.tsx                     # Application entry point
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
npm run dev          # Start development server
npm run lint         # Run ESLint
npm run build        # Production build
npm run preview      # Preview production build
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

### Build Process

1. **Type Checking**: TypeScript compilation
2. **Linting**: ESLint validation
3. **Building**: Vite production build
4. **Asset Optimization**: Minification and compression
5. **Static File Generation**: HTML, CSS, JS bundles

### Environment Configuration

**Production Settings:**
- API endpoint configuration
- Asset path optimization
- Error handling and logging
- Performance monitoring

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
2. **Testing**: Unit and integration tests
3. **Performance**: Virtual scrolling for large lists
4. **Accessibility**: Enhanced screen reader support
5. **Internationalization**: Multi-language support 