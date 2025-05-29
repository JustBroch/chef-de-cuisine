import { useLoaderData } from "react-router";
import { assertIsRecipeResult } from "../types.tsx";

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
