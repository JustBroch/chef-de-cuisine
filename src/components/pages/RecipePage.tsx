import { useLoaderData } from "react-router";
interface RecipeResult {
  recipes: Recipe;
}

interface Recipe {
  id: number;
  name: string;
  prep_time: number;
  cook_time: number;
  total_time: number;
  servings: number;
  ingredients: string[];
  description: string[];
  rating: number;
  url: string;
  cuisine_pat: string;
  nutrition: object;
  timing: object;
  img_src: string;
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
        <h1 className="text-left text-2xl">{recipe.name}</h1>
        <img src={`${recipe.img_src}`} width={250} height={250}></img>
        <h2 className="text-left text-xl mt-3">Ingredients:</h2>
        <p className="text-left mt-1">{recipe.ingredients}</p>
        <h2 className="text-left text-xl mt-3">Instructions:</h2>
        <p className="text-left mt-1">{recipe.description}</p>
        <h2 className="text-left text-xl mt-3">Rating: {recipe.rating}</h2>
      </>
    </div>
  );
}
