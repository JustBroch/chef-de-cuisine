import { useLoaderData, useFetcher, Link } from "react-router";
import { assertIsRecipeResult } from "../types.tsx";
import { useEffect } from "react";

function isObject(value: unknown): value is object {
  return typeof value === "object" && value !== null;
}

export function RecipePage() {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const { recipe, favs } = useLoaderData();
  const fetcher = useFetcher();
  console.log(recipe);
  console.log(favs);
  assertIsRecipeResult(recipe);

  // check favs received
  if (favs && !isObject(favs)) {
    throw new Error("favs not an object");
  }
  if (favs && !("favorites" in favs)) {
    throw new Error("no favorites property");
  }
  if (favs && Array.isArray(favs.favorites)) {
    console.log("It's an array");
  } else {
    console.log("It's not an array");
  }

  // check if favorite already
  let isFavorite = "";
  if (favs) {
    isFavorite = favs.favorites.some((fav) => fav.id === recipe.id);
  }

  const handleClick = () => {
    fetcher.submit(
      { recipeId: recipe.id, action: isFavorite ? "remove" : "add" },
      { method: "post", action: `/recipes/${recipe.id}` }
    );
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            to="/recipes/filter"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-orange-600 bg-white border border-orange-200 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Recipes
          </Link>
        </div>

        {/* Recipe Header */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="md:flex">
            <div className="md:w-1/2">
              <img 
                src={recipe.image_url} 
                alt={recipe.name}
                className="w-full h-64 md:h-full object-cover"
              />
            </div>
            <div className="md:w-1/2 p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{recipe.name}</h1>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">{recipe.description}</p>
              
              {/* Quick Info Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-orange-50 rounded-xl p-4">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">Cook Time</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 mt-1">{recipe.time} mins</p>
                </div>
                
                <div className="bg-amber-50 rounded-xl p-4">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-amber-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">Difficulty</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 mt-1 capitalize">{recipe.difficulty}</p>
                </div>
              </div>

              {/* Cuisine Badge */}
              <div className="mb-6">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {recipe.cuisine} Cuisine
                </span>
              </div>

              {/* Favorite Button */}
              {favs && (
                <button
                  onClick={handleClick}
                  disabled={fetcher.state === "submitting"}
                  className={`w-full flex items-center justify-center py-3 px-6 rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] ${
                    isFavorite
                      ? "bg-red-500 hover:bg-red-600 text-white shadow-lg"
                      : "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {fetcher.state === "submitting" ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <>
                      <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Recipe Details */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Tools Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <svg className="mr-3 h-6 w-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
              </svg>
              Required Tools
            </h2>
            <ul className="space-y-3">
              {recipe.tools.map((tool, index) => (
                <li key={index} className="flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">{tool}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Ingredients Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <svg className="mr-3 h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Ingredients
            </h2>
            <ul className="space-y-3">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
