import {
  useLoaderData,
  useSearchParams,
  useNavigate,
  Form,
  Link,
} from "react-router";
import { type FormEvent } from "react";
import { assertIsRecipesResult } from "../types.tsx";

export function FilterPage() {
  const results = useLoaderData();
  console.log(results);
  assertIsRecipesResult(results);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const time = searchParams.get("time") || "";
  const ingredient1 = searchParams.get("ingredient1") || "";
  const ingredient2 = searchParams.get("ingredient2") || "";
  const ingredient3 = searchParams.get("ingredient3") || "";
  const cuisine = searchParams.get("cuisine") || "";
  const taste = searchParams.get("taste") || "";

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const params = new URLSearchParams();

    for (const [key, value] of formData.entries()) {
      if (value) {
        params.append(key, value as string);
      }
    }

    navigate(`?${params.toString()}`);
  };

  const resetFilters = () => {
    const selects = document.querySelectorAll("select");
    selects.forEach((select) => {
      select.selectedIndex = 0;
    });
    navigate("/recipes/filter/");
  };

  const getSelectStyle = () => {
    return "w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white hover:border-gray-400 transition-all duration-200";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Your Perfect Recipe</h1>
          <p className="text-xl text-gray-600">Filter by your preferences to discover amazing dishes</p>
        </div>

        {/* Filter Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <Form action="/recipes/filter" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {/* Cooking Time */}
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                  <svg className="inline h-4 w-4 mr-1 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Cooking Time
                </label>
                <select
                  id="time"
                  name="time"
                  className={getSelectStyle()}
                  defaultValue={searchParams.get("time") ?? ""}
                >
                  <option value="">Any time</option>
                  <option value="15">15 mins</option>
                  <option value="20">20 mins</option>
                  <option value="25">25 mins</option>
                  <option value="30">30 mins</option>
                  <option value="35">35 mins</option>
                  <option value="40">40 mins</option>
                  <option value="45">45 mins</option>
                  <option value="50">50 mins</option>
                  <option value="55">55 mins</option>
                  <option value="60">60 mins</option>
                  <option value="70">70 mins</option>
                  <option value="80">80 mins</option>
                  <option value="90">90 mins</option>
                  <option value="100">100 mins</option>
                  <option value="110">110 mins</option>
                  <option value="120">120 mins</option>
                </select>
              </div>

              {/* Cuisine */}
              <div>
                <label htmlFor="cuisine" className="block text-sm font-medium text-gray-700 mb-2">
                  <svg className="inline h-4 w-4 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Cuisine
                </label>
                <select
                  id="cuisine"
                  name="cuisine"
                  className={getSelectStyle()}
                  defaultValue={searchParams.get("cuisine") ?? ""}
                >
                  <option value="">Any cuisine</option>
                  <option value="Chinese">Chinese</option>
                  <option value="Italian">Italian</option>
                  <option value="German">German</option>
                  <option value="French">French</option>
                  <option value="American">American</option>
                  <option value="Indian">Indian</option>
                  <option value="Mexican">Mexican</option>
                  <option value="Japanese">Japanese</option>
                </select>
              </div>

              {/* Taste */}
              <div>
                <label htmlFor="taste" className="block text-sm font-medium text-gray-700 mb-2">
                  <svg className="inline h-4 w-4 mr-1 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Taste Profile
                </label>
                <select
                  id="taste"
                  name="taste"
                  className={getSelectStyle()}
                  defaultValue={searchParams.get("taste") ?? ""}
                >
                  <option value="">Any taste</option>
                  <option value="sweet">Sweet</option>
                  <option value="rich">Rich</option>
                  <option value="sour">Sour</option>
                  <option value="fresh">Fresh</option>
                  <option value="savory">Savory</option>
                  <option value="spicy">Spicy</option>
                  <option value="aromatic">Aromatic</option>
                  <option value="creamy">Creamy</option>
                  <option value="crisp">Crisp</option>
                  <option value="tangy">Tangy</option>
                  <option value="buttery">Buttery</option>
                </select>
              </div>
            </div>

            {/* Ingredients */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                <svg className="inline h-5 w-5 mr-2 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Ingredients (optional)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="ingredient1" className="block text-sm font-medium text-gray-700 mb-2">
                    Ingredient 1
                  </label>
                  <select
                    id="ingredient1"
                    name="ingredient1"
                    className={getSelectStyle()}
                    defaultValue={searchParams.get("ingredient1") ?? ""}
                  >
                    <option value="">Select ingredient</option>
                    <option value="lettuce">Lettuce</option>
                    <option value="beef">Beef</option>
                    <option value="eggs">Eggs</option>
                    <option value="milk">Milk</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="ingredient2" className="block text-sm font-medium text-gray-700 mb-2">
                    Ingredient 2
                  </label>
                  <select
                    id="ingredient2"
                    name="ingredient2"
                    className={getSelectStyle()}
                    defaultValue={searchParams.get("ingredient2") ?? ""}
                  >
                    <option value="">Select ingredient</option>
                    <option value="lettuce">Lettuce</option>
                    <option value="beef">Beef</option>
                    <option value="eggs">Eggs</option>
                    <option value="milk">Milk</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="ingredient3" className="block text-sm font-medium text-gray-700 mb-2">
                    Ingredient 3
                  </label>
                  <select
                    id="ingredient3"
                    name="ingredient3"
                    className={getSelectStyle()}
                    defaultValue={searchParams.get("ingredient3") ?? ""}
                  >
                    <option value="">Select ingredient</option>
                    <option value="lettuce">Lettuce</option>
                    <option value="beef">Beef</option>
                    <option value="eggs">Eggs</option>
                    <option value="milk">Milk</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                className="flex-1 flex items-center justify-center py-3 px-6 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transform hover:scale-[1.02] transition-all duration-200"
              >
                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Apply Filters
              </button>
              <button
                type="button"
                onClick={resetFilters}
                className="flex-1 sm:flex-initial flex items-center justify-center py-3 px-6 border border-gray-300 rounded-xl shadow-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transform hover:scale-[1.02] transition-all duration-200"
              >
                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Clear Filters
              </button>
            </div>
          </Form>
        </div>

        {/* Active Filters */}
        {(time || cuisine || taste || ingredient1 || ingredient2 || ingredient3) && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Filters:</h2>
            <div className="flex flex-wrap gap-2">
              {time && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                  <svg className="mr-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {time} mins
                </span>
              )}
              {cuisine && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <svg className="mr-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {cuisine}
                </span>
              )}
              {taste && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                  <svg className="mr-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {taste}
                </span>
              )}
              {[ingredient1, ingredient2, ingredient3].filter(Boolean).map((ingredient, index) => (
                <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
                  <svg className="mr-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  {ingredient}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recipe Results</h2>
            <span className="text-sm text-gray-500">
              {results.recipes.length} {results.recipes.length === 1 ? 'recipe' : 'recipes'} found
            </span>
          </div>

          {results.recipes.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No recipes found</h3>
              <p className="mt-2 text-gray-500">Try adjusting your filters to see more results.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.recipes.map((result) => (
                <Link
                  key={result.id}
                  to={`/recipes/${result.id}`}
                  className="group block bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
                >
                  <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                    <img 
                      src={result.image_url} 
                      alt={result.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors duration-200 mb-2">
                      {result.name}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                      {result.description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span className="flex items-center">
                        <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {result.time} mins
                      </span>
                      <span className="capitalize">{result.difficulty}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
