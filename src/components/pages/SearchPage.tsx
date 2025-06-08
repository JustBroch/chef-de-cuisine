import { useLoaderData, useSearchParams, Link } from "react-router";
import { assertIsRecipesResult } from "../types.tsx";
import { Search, ChefHat, BookOpen, Clock } from "lucide-react";
import { formatCookingTime } from "../../lib/timeUtils";

export function SearchPage() {
  const results = useLoaderData();
  assertIsRecipesResult(results);
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto py-12">
        {/* Search Header */}
        <div className="bg-white rounded-2xl shadow-xl border border-orange-100 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Search Results for "{query}"
                </h1>
                <p className="text-orange-100">
                  {results?.recipes.length === 0 
                    ? "No recipes found matching your search" 
                    : `Found ${results.recipes.length} recipe${results.recipes.length !== 1 ? 's' : ''}`
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Results */}
        <div className="bg-white rounded-2xl shadow-xl border border-orange-100 overflow-hidden">
          <div className="p-8">
            {results?.recipes.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-700 mb-3">No recipes found</h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                  We couldn't find any recipes matching "{query}". Try searching with different keywords or browse our recipe categories.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/recipes/filter"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 px-6 rounded-lg font-medium hover:from-orange-600 hover:to-amber-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <BookOpen className="w-4 h-4" />
                    Browse All Recipes
                  </Link>
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 bg-white text-orange-600 py-3 px-6 rounded-lg font-medium border-2 border-orange-200 hover:bg-orange-50 transition-all duration-200"
                  >
                    <ChefHat className="w-4 h-4" />
                    Back to Home
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {results.recipes.map((recipe) => (
                  <Link
                    key={recipe.id}
                    to={`/recipes/${recipe.id}`}
                    className="group block bg-white rounded-2xl border-2 border-gray-100 hover:border-orange-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
                  >
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={recipe.image_url} 
                        alt={recipe.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-200 mb-3">
                        {recipe.name}
                      </h3>
                      <p className="text-gray-600 line-clamp-3 text-sm leading-relaxed mb-4">
                        {recipe.description}
                      </p>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <Clock className="w-4 h-4" />
                          <span>{recipe.time ? formatCookingTime(recipe.time) : 'View Recipe'}</span>
                        </div>
                        <div className="text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <BookOpen className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
