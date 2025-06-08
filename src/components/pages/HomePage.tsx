import image from "../../assets/image.jpg";
import { Link } from "react-router";

export function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Welcome to
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
                    {" "}Chef de Cuisine
                  </span>
                </h1>
                <p className="text-xl text-gray-600 max-w-lg leading-relaxed">
                  Discover amazing recipes, filter by your preferences, and build your personal cookbook.
                  From quick meals to gourmet dishes - find your next culinary adventure.
                </p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/recipes/filter"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl hover:from-orange-600 hover:to-amber-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Explore Recipes
                  <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                
                <Link
                  to="/recipes/search"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:border-orange-500 hover:text-orange-600 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Search Recipes
                  <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </Link>
              </div>

              {/* Feature Pills */}
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                  <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Quick Filters
                </span>
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
                  <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Save Favorites
                </span>
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Easy to Follow
                </span>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-300">
                <img 
                  src={image} 
                  alt="Delicious food showcasing Chef de Cuisine recipes" 
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              
              {/* Floating Cards */}
              <div className="absolute -top-4 -left-4 bg-white rounded-xl shadow-lg p-4 transform -rotate-6 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">1000+ Recipes</span>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg p-4 transform rotate-6 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">All Cuisines</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What would you like to cook today?
            </h2>
            <p className="text-lg text-gray-600">
              Browse by categories or search for something specific
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link
              to="/recipes/filter?cuisine=Italian"
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-50 to-orange-50 p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="text-4xl mb-4">🍝</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Italian Cuisine</h3>
                <p className="text-gray-600">Pasta, pizza, and traditional Italian dishes</p>
              </div>
            </Link>

            <Link
              to="/recipes/filter?cuisine=Asian"
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-50 to-teal-50 p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="text-4xl mb-4">🍜</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Asian Cuisine</h3>
                <p className="text-gray-600">Stir-fries, noodles, and Asian flavors</p>
              </div>
            </Link>

            <Link
              to="/recipes/filter?time=30"
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Quick Meals</h3>
                <p className="text-gray-600">30 minutes or less cooking time</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
