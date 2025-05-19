import type { FormEvent } from "react";
import { useLoaderData, Form, useSearchParams, Link } from "react-router";
interface SearchResult {
  recipes: Recipe[];
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

function assertIsSearchResult(
  searchData: unknown
): asserts searchData is SearchResult[] {
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

export function RecipesPage() {
  const results = useLoaderData();
  assertIsSearchResult(results);
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newQuery = formData.get("q") as string;
    setSearchParams({ q: newQuery });
  };
  return (
    <>
      <Form onSubmit={handleSubmit}>
        <label htmlFor="recipeName">Recipe Name:</label>
        <input
          className="border-grey-600 border p-1 m-2"
          type="text"
          id="recipeName"
          name="q"
          defaultValue={query}
        />
        <button
          className="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
          type="submit"
        >
          Search
        </button>
      </Form>
      <div>
        <p>Results:</p>
        {results.recipes.length === 0 ? (
          <p> No results</p>
        ) : (
          <ul>
            {results.recipes.map((recipe: SearchResult) => (
              <li key={recipe.id}>
                <h3>
                  <Link to={`${recipe.id}`}>{recipe.name}</Link>
                </h3>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
