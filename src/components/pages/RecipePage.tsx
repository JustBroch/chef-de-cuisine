import { useLoaderData, useFetcher } from "react-router";
import { assertIsRecipeResult } from "../types.tsx";

function isObject(value: unknown): value is object {
  return typeof value === "object" && value !== null;
}

export function RecipePage() {
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
      <h2 className="text-left text-xl mt-3">
        Difficulty: {recipe.difficulty}
      </h2>
      <div className="text-left">
        {favs && (
          <button
            className="rounded-md bg-slate-800 py-1 px-2 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2 mt-5 mb-5"
            onClick={handleClick}
            disabled={fetcher.state === "submitting"}
          >
            {isFavorite ? "Remove from Favourites" : "Add to Favourites"}
          </button>
        )}
      </div>
    </div>
  );
}
