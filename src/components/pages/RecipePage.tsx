import { useLoaderData } from "react-router";
interface RecipeResult {
  recipes: Recipe;
}

interface Recipe {
  id: number;
  name: string;
  ingredients: string[];
  instructions: string[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: string;
  cuisine: string;
  caloriesPerServing: number;
  tags: string[];
  userId: number;
  image: string;
  rating: number;
  reviewCount: number;
  mealType: string[];
}

function assertIsRecipeResult(
  recipeData: unknown
): asserts recipeData is Recipe {
  // if (!Array.isArray(searchData)) {
  //   throw new Error("result not an array");
  // }
  // if (searchData.length === 0) {
  //   return;
  // }
  // searchData.forEach((result) => {
  //   if (!("id" in result)) {
  //     throw new Error("result has no id");
  //   }
  //   if (!("name" in result)) {
  //     throw new Error("result has no name");
  //   }
}

export function RecipePage() {
  const recipe = useLoaderData();
  assertIsRecipeResult(recipe);

  return (
    <div>
      <>
        <h1>{recipe.name}</h1>
        <p>{recipe.instructions}</p>
        <p>{recipe.ingredients}</p>
        <p>{recipe.rating}</p>
      </>
    </div>
  );
}
