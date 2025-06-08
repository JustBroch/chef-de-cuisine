import { useLoaderData, Link } from "react-router";
import { User, Mail, Heart, ChefHat, BookOpen, Clock } from "lucide-react";
import { formatCookingTime } from "../../lib/timeUtils";

interface UserDetails {
  username: string;
  email: string;
}

interface Recipe {
  id: number;
  name: string;
  description?: string;
  image_url?: string;
  time?: number;
  cuisine?: string;
}

interface Favorites {
  favorites: Recipe[];
}

function isObject(value: unknown): value is object {
  return typeof value === "object" && value !== null;
}

export function UserProfilePage() {
  const { userDetails, favs } = useLoaderData() as { userDetails: UserDetails; favs: Favorites };

  // check favs received
  if (!isObject(favs)) {
    throw new Error("favs not an object");
  }
  if (!("favorites" in favs)) {
    throw new Error("no favorites property");
  }

  // check favs received
  if (!isObject(userDetails)) {
    throw new Error("userDetails not an object");
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto py-12">
        {/* My Profile Header */}
        <div className="bg-white rounded-2xl shadow-xl border border-orange-100 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
                <p className="text-orange-100">Your culinary journey at Chef de Cuisine</p>
              </div>
            </div>
          </div>
          
          <div className="p-8">
            <div className="grid gap-6">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <p className="text-lg font-semibold text-gray-900">{userDetails.username}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-lg font-semibold text-gray-900">{userDetails.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Favorite Recipes Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-orange-100 overflow-hidden">
          <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-6">
            <div className="flex items-center gap-3">
              <Heart className="w-6 h-6 text-white" />
              <h2 className="text-2xl font-bold text-white">Favourite Recipes</h2>
            </div>
            <p className="text-pink-100 mt-1">Your saved culinary inspirations</p>
          </div>
          
          <div className="p-8">
            {favs.favorites.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ChefHat className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No favorites yet</h3>
                <p className="text-gray-500 mb-6">Start exploring our recipes and save your favorites!</p>
                <Link
                  to="/recipes/filter"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 px-6 rounded-lg font-medium hover:from-orange-600 hover:to-amber-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <BookOpen className="w-4 h-4" />
                  Browse Recipes
                </Link>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {favs.favorites.map((recipe) => (
                  <Link
                    key={recipe.id}
                    to={`/recipes/${recipe.id}`}
                    className="group block bg-white rounded-2xl border-2 border-gray-100 hover:border-pink-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
                  >
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={recipe.image_url} 
                        alt={recipe.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Heart className="w-4 h-4 text-pink-500 fill-current" />
                        <span className="text-xs font-medium text-pink-600 uppercase tracking-wide">Favorite</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-pink-600 transition-colors duration-200 mb-3">
                        {recipe.name}
                      </h3>
                      {recipe.description && (
                        <p className="text-gray-600 line-clamp-3 text-sm leading-relaxed mb-4">
                          {recipe.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-4 text-gray-500 text-sm">
                          {recipe.time && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{formatCookingTime(recipe.time)}</span>
                            </div>
                          )}
                          {recipe.cuisine && (
                            <span className="px-2 py-1 bg-gray-100 rounded-md text-xs font-medium">
                              {recipe.cuisine}
                            </span>
                          )}
                        </div>
                        <div className="text-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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
