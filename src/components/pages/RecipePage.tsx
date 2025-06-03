import { useLoaderData, useFetcher } from "react-router";
import { assertIsRecipeResult, assertIsRecipesResult } from "../types.tsx";

// function isObject(value: unknown): value is object {
//   return typeof value === "object" && value !== null;
// }

export function RecipePage() {
  const { recipe, favs } = useLoaderData();
  const fetcher = useFetcher();
  assertIsRecipeResult(recipe);
  assertIsRecipesResult(favs);
  // check favs received
  // if (!isObject(favs)) {
  //   throw new Error("favs not an object");
  // }
  // if (!("favorites" in favs)) {
  //   throw new Error("no favorites property");
  // }
  // if (Array.isArray(favs.favorites)) {
  //   console.log("It's an array");
  // } else {
  //   console.log("It's not an array");
  // }
  // const favorites = favs.favorites as number[];

  // check if favorite already
  const isFavorite = favs.recipes.some((fav) => fav.id === recipe.id);

  const handleClick = () => {
    fetcher.submit(
      { recipeId: recipe.id, action: isFavorite ? "remove" : "add" },
      { method: "post", action: `/recipes/${recipe.id}` }
    );
  };

  return (
    <div>
      <h1 className="text-left text-2xl">{recipe.name}</h1>

      <img src={`${recipe.img_url}`} width={250} height={250}></img>
      <h2 className="text-left text-xl mt-3">Description:</h2>
      <p className="text-left">{recipe.description}</p>
      <h2 className="text-left text-xl mt-3">
        Cuisine Style: {recipe.cuisine}
      </h2>
      <h2 className="text-left text-xl mt-3">Time: {recipe.time} mins</h2>
      <h2 className="text-left text-xl mt-3">Tools: </h2>
      <ul className="text-left ml-5 list-disc mt-3">
        {recipe.tools.map((tool, index) => (
          <li key={index}>{tool}</li>
        ))}
      </ul>
      <h2 className="text-left text-xl mt-3">Ingredients:</h2>
      <ul className="text-left ml-5 list-disc mt-3">
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>
      <h2 className="text-left text-xl mt-3">Ingredient Preparation:</h2>
      <ul className="text-left ml-5 list-disc mt-3">
        {recipe.ingredients_preparation.split(",").map((prep, index) => (
          <li key={index}>{prep}</li>
        ))}
      </ul>
      <h2 className="text-left text-xl mt-3">Instructions:</h2>
      <ol className="text-left ml-5 list-decimal mt-3">
        {recipe.steps
          .split(".")
          .slice(0, -1)
          .map((step, index) => (
            <li key={index}>{step}.</li>
          ))}
      </ol>
      <h2 className="text-left text-xl mt-3">
        Difficulty: {recipe.difficulty}
      </h2>
      <button onClick={handleClick} disabled={fetcher.state === "submitting"}>
        {isFavorite ? "Remove from favourites" : "Add to favourites"}
      </button>
    </div>
  );
}
