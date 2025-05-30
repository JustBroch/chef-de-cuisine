import { useLoaderData } from "react-router";
import { assertIsRecipeResult } from "../types.tsx";

export function RecipePage() {
  const recipe = useLoaderData();
  assertIsRecipeResult(recipe);

  return (
    <div>
      <h1 className="text-left text-2xl">{recipe.name}</h1>
      <img src={`${recipe.img_src}`} width={250} height={250}></img>
      <h2 className="text-left text-xl mt-3">Ingredients:</h2>
      <ul className="text-left ml-5 list-disc mt-3">
        {recipe.ingredients.split(",").map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>

      <h2 className="text-left text-xl mt-3">Instructions:</h2>
      <ol className="text-left ml-5 list-decimal mt-3">
        {recipe.description
          .split(".")
          .slice(0, -1)
          .map((step, index) => (
            <li key={index}>{step}.</li>
          ))}
      </ol>
      <h2 className="text-left text-xl mt-3">Rating: {recipe.rating}</h2>
    </div>
  );
}
