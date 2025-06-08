# Chef de Cuisine 🍳

A modern recipe discovery and management platform built with React and Flask. Find, filter, and save your favorite recipes with an intuitive and responsive interface.

## Features

### 🔍 Advanced Recipe Search & Filtering
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

### 🎨 Design System
- **Consistent Theming**: Orange/amber gradient color scheme
- **Component Library**: Reusable UI components with Tailwind CSS
- **Typography**: Responsive text sizing and proper contrast ratios
- **Interactive Elements**: Hover effects and loading states

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
- Python 3.8+ (for backend)

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

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Initialize database
python app.py

# Start Flask server
flask run
```

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── pages/           # Page components
│   │   ├── ui/              # Reusable UI components
│   │   ├── layouts/         # Layout wrappers
│   │   ├── DynamicIngredients.tsx
│   │   ├── SearchForm.tsx
│   │   ├── navbar.tsx
│   │   └── footer.tsx
│   ├── lib/                 # Utility functions
│   ├── assets/              # Static assets
│   └── App.tsx
├── backend/                 # Flask API
├── public/                  # Public assets
├── frontend.md              # Frontend documentation
├── backend.md               # Backend documentation
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

## Documentation

- **[Frontend Documentation](frontend.md)** - Detailed frontend architecture and components
- **[Backend Documentation](backend.md)** - API endpoints and database design
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

Built with ❤️ by the Chef de Cuisine team
