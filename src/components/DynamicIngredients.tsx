import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";

interface DynamicIngredientsProps {
  initialIngredients?: string[];
  onChange: (ingredients: string[]) => void;
}

const AVAILABLE_INGREDIENTS = [
  "lettuce", "beef", "eggs", "milk", "chicken", "tomato", "onion", "garlic", 
  "cheese", "pasta", "rice", "potato", "carrot", "broccoli", "spinach", 
  "mushroom", "pepper", "basil", "olive oil", "butter", "flour", "sugar",
  "salt", "pepper", "lemon", "avocado", "bread", "salmon", "shrimp", "bacon"
];

export function DynamicIngredients({ initialIngredients = [], onChange }: DynamicIngredientsProps) {
  const [ingredients, setIngredients] = useState<string[]>(initialIngredients);
  const [inputValue, setInputValue] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredIngredients, setFilteredIngredients] = useState(AVAILABLE_INGREDIENTS);

  // Only sync on initial mount - no external syncing to avoid conflicts
  useEffect(() => {
    if (ingredients.length === 0 && initialIngredients.length > 0) {
      setIngredients(initialIngredients);
    }
  }, [initialIngredients.join(',')]); // Use string comparison to avoid unnecessary re-renders

  useEffect(() => {
    onChange(ingredients);
  }, [ingredients, onChange]);

  useEffect(() => {
    const filtered = AVAILABLE_INGREDIENTS.filter(ingredient => 
      ingredient.toLowerCase().includes(inputValue.toLowerCase()) &&
      !ingredients.includes(ingredient)
    );
    setFilteredIngredients(filtered);
  }, [inputValue, ingredients]);

  const addIngredient = (ingredient: string) => {
    if (ingredient && !ingredients.includes(ingredient)) {
      setIngredients([...ingredients, ingredient]);
      setInputValue("");
      setIsDropdownOpen(false);
    }
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    setIsDropdownOpen(value.length > 0);
  };

  const handleCustomIngredient = () => {
    if (inputValue.trim() && !ingredients.includes(inputValue.trim())) {
      addIngredient(inputValue.trim());
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        <svg className="inline h-5 w-5 mr-2 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        Ingredients (optional)
      </h3>

      {/* Ingredients Stack */}
      <div className="flex flex-wrap items-center gap-3">
        {ingredients.map((ingredient, index) => (
          <div
            key={index}
            className="group relative inline-flex items-center bg-amber-100 text-amber-800 px-3 py-2 rounded-lg text-sm font-medium hover:bg-amber-200 transition-all duration-200"
          >
            <span className="capitalize">{ingredient}</span>
            <button
              type="button"
              onClick={() => removeIngredient(index)}
              className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-amber-600 hover:text-amber-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}

        {/* Add Ingredient Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="inline-flex items-center bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-orange-600 hover:to-amber-600 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Ingredient
          </button>

          {/* Dropdown */}
          {isDropdownOpen && (
            <div className="absolute top-full mt-2 left-0 z-10 w-80 bg-white border border-gray-200 rounded-xl shadow-lg">
              <div className="p-4">
                <input
                  type="text"
                  placeholder="Search or type ingredient..."
                  value={inputValue}
                  onChange={(e) => handleInputChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  autoFocus
                />
                
                {inputValue && !AVAILABLE_INGREDIENTS.some(ing => ing.toLowerCase() === inputValue.toLowerCase()) && (
                  <button
                    type="button"
                    onClick={handleCustomIngredient}
                    className="w-full mt-2 px-3 py-2 text-left text-orange-600 hover:bg-orange-50 rounded-lg transition-colors duration-200"
                  >
                    Add "{inputValue}"
                  </button>
                )}
              </div>
              
              <div className="max-h-48 overflow-y-auto border-t border-gray-100">
                {filteredIngredients.map((ingredient) => (
                  <button
                    key={ingredient}
                    type="button"
                    onClick={() => addIngredient(ingredient)}
                    className="w-full px-4 py-2 text-left capitalize hover:bg-gray-50 transition-colors duration-200"
                  >
                    {ingredient}
                  </button>
                ))}
                {filteredIngredients.length === 0 && inputValue && (
                  <div className="px-4 py-3 text-gray-500 text-sm">
                    No matching ingredients found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hidden inputs for form submission */}
      {ingredients.map((ingredient, index) => (
        <input
          key={`ingredient-${index}`}
          type="hidden"
          name="ingredients"
          value={ingredient}
        />
      ))}
    </div>
  );
} 