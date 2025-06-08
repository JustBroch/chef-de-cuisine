import {
  useLoaderData,
  useSearchParams,
  useNavigate,
  Form,
  Link,
} from "react-router";
import { type FormEvent, useState, useEffect, useMemo } from "react";
import { assertIsRecipesResult } from "../types.tsx";
import { DynamicIngredients } from "../DynamicIngredients";
import { formatCookingTime } from "../../lib/timeUtils";

export function FilterPage() {
  const results = useLoaderData();

  assertIsRecipesResult(results);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Scroll to top when component mounts (fixes cuisine redirect bug)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const time = searchParams.get("time") || "";
  const cuisine = searchParams.get("cuisine") || "";
  const taste = searchParams.get("taste") || "";
  
  // Handle ingredients from URL params (these are the APPLIED ingredients in active filters)
  const ingredientsParam = searchParams.get("ingredients");
  const appliedIngredients = useMemo(() => 
    ingredientsParam ? ingredientsParam.split(',') : [], 
    [ingredientsParam]
  );
  
  // Form state for ingredients being selected (but not yet applied)
  const [formIngredients, setFormIngredients] = useState<string[]>(appliedIngredients);
  
  // Track if user manually cleared ingredients to prevent auto-sync
  const [userClearedIngredients, setUserClearedIngredients] = useState(false);

  // Sync form ingredients with URL params when they change (for removals from active filters)
  // But only if user hasn't manually cleared them
  useEffect(() => {
    if (!userClearedIngredients) {
      setFormIngredients(appliedIngredients);
    }
  }, [appliedIngredients, userClearedIngredients]);
  
  // Reset the user cleared flag when applied ingredients change from outside
  useEffect(() => {
    setUserClearedIngredients(false);
  }, [ingredientsParam]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const params = new URLSearchParams();

    // Add non-ingredient form data
    for (const [key, value] of formData.entries()) {
      if (value && key !== 'ingredients') {
        params.append(key, value as string);
      }
    }

    // Add ingredients as comma-separated string
    if (formIngredients.length > 0) {
      params.append('ingredients', formIngredients.join(','));
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

  const removeFilter = (filterType: string) => {
    const params = new URLSearchParams(searchParams);
    
    if (filterType === 'time') {
      params.delete('time');
      // Clear the dropdown
      const timeSelect = document.getElementById('time') as HTMLSelectElement;
      if (timeSelect) timeSelect.value = '';
    } else if (filterType === 'cuisine') {
      params.delete('cuisine');
      // Clear the dropdown
      const cuisineSelect = document.getElementById('cuisine') as HTMLSelectElement;
      if (cuisineSelect) cuisineSelect.value = '';
    } else if (filterType === 'taste') {
      params.delete('taste');
      // Clear the dropdown
      const tasteSelect = document.getElementById('taste') as HTMLSelectElement;
      if (tasteSelect) tasteSelect.value = '';
    }
    
    navigate(`?${params.toString()}`);
  };

  const removeIngredient = (ingredientToRemove: string) => {
    const updatedIngredients = appliedIngredients.filter((ingredient: string) => ingredient !== ingredientToRemove);
    setFormIngredients(updatedIngredients);
    
    // Update URL - this will trigger the page to re-render with new initialIngredients
    const params = new URLSearchParams(searchParams);
    if (updatedIngredients.length > 0) {
      params.set('ingredients', updatedIngredients.join(','));
    } else {
      params.delete('ingredients');
    }
    
    navigate(`?${params.toString()}`);
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
                  <option value="15">Quick (15 mins)</option>
                  <option value="20">Quick (20 mins)</option>
                  <option value="25">Quick (25 mins)</option>
                  <option value="30">Quick (30 mins)</option>
                  <option value="40">Medium (30-40 mins)</option>
                  <option value="50">Medium (40-50 mins)</option>
                  <option value="60">Medium (50-60 mins)</option>
                  <option value="75">Longer (1-1.5 hours)</option>
                  <option value="90">Longer (1.5 hours)</option>
                  <option value="120">Extended (~2 hours)</option>
                  <option value="180">Extended (~3 hours)</option>
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

            {/* Dynamic Ingredients */}
            <div className="mb-6">
                          <DynamicIngredients 
              key={appliedIngredients.join(',')} 
              initialIngredients={appliedIngredients}
              onChange={(ingredients) => {
                setFormIngredients(ingredients);
                // If user manually reduced ingredients, set the flag to prevent auto-sync
                if (ingredients.length < appliedIngredients.length) {
                  setUserClearedIngredients(true);
                }
              }}
            />
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
        {(time || cuisine || taste || appliedIngredients.length > 0) && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Filters:</h2>
            <div className="flex flex-wrap gap-2">
              {time && (
                <span className="group inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 hover:bg-orange-200 transition-colors duration-200">
                  <svg className="mr-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {formatCookingTime(parseInt(time))}
                  <button
                    onClick={() => removeFilter('time')}
                    className="ml-2 opacity-0 group-hover:opacity-100 hover:bg-orange-300 rounded-full p-0.5 transition-all duration-200"
                    aria-label="Remove time filter"
                  >
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
              {cuisine && (
                <span className="group inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 hover:bg-green-200 transition-colors duration-200">
                  <svg className="mr-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {cuisine}
                  <button
                    onClick={() => removeFilter('cuisine')}
                    className="ml-2 opacity-0 group-hover:opacity-100 hover:bg-green-300 rounded-full p-0.5 transition-all duration-200"
                    aria-label="Remove cuisine filter"
                  >
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
              {taste && (
                <span className="group inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 hover:bg-purple-200 transition-colors duration-200">
                  <svg className="mr-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {taste}
                  <button
                    onClick={() => removeFilter('taste')}
                    className="ml-2 opacity-0 group-hover:opacity-100 hover:bg-purple-300 rounded-full p-0.5 transition-all duration-200"
                    aria-label="Remove taste filter"
                  >
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
              {appliedIngredients.length > 0 && (
                <div className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium bg-amber-50 text-amber-900 border border-amber-200">
                  <svg className="mr-2 h-4 w-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <span className="font-semibold mr-2">Ingredients:</span>
                  <div className="flex flex-wrap gap-1">
                    {appliedIngredients.map((ingredient: string, index: number) => (
                      <span key={index} className="group inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors duration-200">
                        <span className="capitalize mr-1">{ingredient}</span>
                        <button
                          onClick={() => removeIngredient(ingredient)}
                          className="opacity-0 group-hover:opacity-100 hover:bg-amber-300 rounded-full p-0.5 transition-all duration-200"
                          aria-label={`Remove ${ingredient}`}
                        >
                          <svg className="h-2.5 w-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
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
                        {formatCookingTime(result.time)}
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

