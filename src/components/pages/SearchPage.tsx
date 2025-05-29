import { useLoaderData, useSearchParams, Link } from "react-router";
import { assertIsRecipesResult } from "../types.tsx";

export function SearchPage() {
  const results = useLoaderData();
  assertIsRecipesResult(results);
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  return (
    <>
      <div>
        <h2 className="text-left text-xl mt-3">
          Search Results for "{query}":
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
