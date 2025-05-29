import { type FormEvent } from "react";
import { useLoaderData, Form, useSearchParams, Link } from "react-router";
import { assertIsRecipesResult } from "../types.tsx";

export function RecipesPage() {
  const results = useLoaderData();
  assertIsRecipesResult(results);
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
        <label htmlFor="recipeName">Recipe:</label>
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
        <h2 className="text-left text-xl mt-3">Results:</h2>
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
