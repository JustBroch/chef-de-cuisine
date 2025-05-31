import { useLoaderData, useSearchParams, Link, Form } from "react-router";
import { assertIsRecipesResult } from "../types.tsx";

export function FilterPage() {
  const results = useLoaderData();
  assertIsRecipesResult(results);
  const [searchParams] = useSearchParams();
  const time = searchParams.get("time") || "";
  const ingredient1 = searchParams.get("ingredient1") || "";
  const ingredient2 = searchParams.get("ingredient2") || "";
  const ingredient3 = searchParams.get("ingredient3") || "";
  const cuisine = searchParams.get("cuisine") || "";
  return (
    <>
      <Form action="/recipes/filter">
        <div>
          <label htmlFor="time">Total Time:</label>
          <select
            id="time"
            name="time"
            defaultValue={searchParams.get("time") ?? ""}
          >
            <option value="">-----</option>
            <option value="20 mins">20 mins</option>
            <option value="25 mins">25 mins</option>
            <option value="30 mins">30 mins</option>
            <option value="35 mins">35 mins</option>
            <option value="40 mins">40 mins</option>
            <option value="45 mins">45 mins</option>
            <option value="50 mins">50 mins</option>
            <option value="55 mins">55 mins</option>
            <option value="1 hrs">1 hrs</option>
            <option value="1 hrs 10 mins">1 hrs 10 mins</option>
            <option value="1 hrs 20 mins">1 hrs 20 mins</option>
            <option value="1 hrs 30 mins">1 hrs 30 mins</option>
            <option value="1 hrs 40 mins">1 hrs 40 mins</option>
            <option value="1 hrs 50 mins">1 hrs 50 mins</option>
          </select>
        </div>
        <div>
          <label htmlFor="cuisine">Cuisine Type:</label>
          <select
            id="cuisine"
            name="cuisine"
            defaultValue={searchParams.get("cuisine") ?? ""}
          >
            <option value="">-----</option>
            <option value="Chinese">Chinese</option>
            <option value="Italian">Italian</option>
            <option value="German">German</option>
            <option value="French">French</option>
          </select>
        </div>
        <div>
          <label htmlFor="ingredient1">Ingredient 1:</label>
          <select
            id="ingredient1"
            name="ingredient1"
            defaultValue={searchParams.get("ingredient1") ?? ""}
          >
            <option value="">-----</option>
            <option value="chicken">Chicken</option>
            <option value="beef">Beef</option>
            <option value="cheese">Cheese</option>
            <option value="milk">Milk</option>
          </select>
        </div>
        <div>
          <label htmlFor="ingredient2">Ingredient 2:</label>
          <select
            id="ingredient2"
            name="ingredient2"
            defaultValue={searchParams.get("ingredient2") ?? ""}
          >
            <option value="">-----</option>
            <option value="chicken">Chicken</option>
            <option value="beef">Beef</option>
            <option value="cheese">Cheese</option>
            <option value="milk<">Milk</option>
          </select>
        </div>
        <div>
          <label htmlFor="ingredient3">Ingredient 3:</label>
          <select
            id="ingredient3"
            name="ingredient3"
            defaultValue={searchParams.get("ingredient3") ?? ""}
          >
            <option value="">-----</option>
            <option value="Chicken">Chicken</option>
            <option value="Beef">Beef</option>
            <option value="Cheese">Cheese</option>
            <option value="Milk">Milk</option>
          </select>
        </div>
        <button
          className="rounded-md bg-slate-800 py-1 px-2 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
          type="submit"
        >
          Filter
        </button>
      </Form>
      <div>
        <h2 className="text-left text-xl mt-3">
          Results for filtering on time "{time}", ingredients "{ingredient1}", "
          {ingredient2}", "{ingredient3}", "{cuisine}":
        </h2>
        {results.length === 0 ? (
          <p> No results</p>
        ) : (
          <ul className="text-left mt-3">
            {results.map((result) => (
              <li key={result.id}>
                <h3>
                  <Link
                    to={`/recipes/${result.id}`}
                    className="hover: underline"
                  >
                    {result.name}
                  </Link>
                </h3>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
