import {
  useLoaderData,
  useSearchParams,
  Link,
  Form,
  useNavigate,
} from "react-router";

import { type FormEvent } from "react";

import { assertIsRecipesResult } from "../types.tsx";

export function FilterPage() {
  const navigate = useNavigate();
  const results = useLoaderData();
  assertIsRecipesResult(results);
  const [searchParams] = useSearchParams();
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

  const resetFilters = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const selects = document.querySelectorAll("select");
    selects.forEach((select) => {
      select.selectedIndex = 0; // Or select.selectedIndex = 0;
    });
    navigate("/recipes/filter/");
  };

  return (
    <>
      <h1 className="text-left text-xl mt-3">
        Apply filters to find the recipe you would like:
      </h1>
      <div className="text-left mt-3">
        <Form action="/recipes/filter" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="time">Cooking Time: </label>
            <select
              id="time"
              name="time"
              className="mr-5"
              defaultValue={searchParams.get("time") ?? ""}
            >
              <option value="">---------</option>
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

            <label htmlFor="cuisine">Cuisine: </label>
            <select
              id="cuisine"
              name="cuisine"
              className="mr-5"
              defaultValue={searchParams.get("cuisine") ?? ""}
            >
              <option value="">---------</option>
              <option value="Chinese">Chinese</option>
              <option value="Italian">Italian</option>
              <option value="German">German</option>
              <option value="French">French</option>
              <option value="American">American</option>
              <option value="Indian">Indian</option>
              <option value="Mexican">Mexican</option>
              <option value="Japanese">Japanese</option>
            </select>

            <label htmlFor="cuisine">Taste: </label>
            <select
              id="taste"
              name="taste"
              className="mr-5"
              defaultValue={searchParams.get("taste") ?? ""}
            >
              <option value="">---------</option>
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
          <div className="mt-3">
            <label htmlFor="ingredient1">Ingredient 1: </label>
            <select
              id="ingredient1"
              name="ingredient1"
              className="mr-5 mt-5 mb-3"
              defaultValue={searchParams.get("ingredient1") ?? ""}
            >
              <option value="">---------</option>
              <option value="lettuce">lettuce</option>
              <option value="beef">beef</option>
              <option value="eggs">eggs</option>
              <option value="milk">milk</option>
            </select>

            <label htmlFor="ingredient2">Ingredient 2: </label>
            <select
              id="ingredient2"
              name="ingredient2"
              className="mr-5"
              defaultValue={searchParams.get("ingredient2") ?? ""}
            >
              <option value="">---------</option>
              <option value="lettuce">lettuce</option>
              <option value="beef">beef</option>
              <option value="eggs">eggs</option>
              <option value="milk">milk</option>
            </select>

            <label htmlFor="ingredient3">Ingredient 3: </label>
            <select
              id="ingredient3"
              name="ingredient3"
              defaultValue={searchParams.get("ingredient3") ?? ""}
            >
              <option value="">---------</option>
              <option value="lettuce">lettuce</option>
              <option value="beef">beef</option>
              <option value="eggs">eggs</option>
              <option value="milk">milk</option>
            </select>
          </div>
          <button
            className="rounded-md bg-slate-800 py-1 px-2 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none  mt-3"
            type="submit"
          >
            Apply Filters
          </button>
          <button
            className="rounded-md bg-slate-800 py-1 px-2 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none  mt-3 ml-8"
            onClick={resetFilters}
          >
            Clear Filters
          </button>
        </Form>
        <div>
          <h2 className="text-left text-xl mt-10">Filters Applied:</h2>
          <ul className="text-left mt-1">
            {time && <li>Time: {time} mins</li>}
            {cuisine && <li>Cuisine Category: {cuisine}</li>}
            {taste && <li>Taste: {taste}</li>}
            {(ingredient1 || ingredient2 || ingredient3) && (
              <li>
                Ingredients: {ingredient1 ? ingredient1 : ""}
                {ingredient2 ? "," + ingredient2 : ""}
                {ingredient3 ? "," + ingredient3 : ""}
              </li>
            )}
          </ul>

          <h2 className="text-left text-xl mt-10">Recipe Results:</h2>
          {results.recipes.length === 0 ? (
            <p> No results</p>
          ) : (
            <ul className="text-left mt-3">
              {results.recipes.map((result) => (
                <li key={result.id}>
                  <h3>
                    <Link
                      to={`/recipes/${result.id}`}
                      className="hover: underline"
                    >
                      {result.name}
                    </Link>
                  </h3>
                  <p className="mb-3"> {result.description}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
