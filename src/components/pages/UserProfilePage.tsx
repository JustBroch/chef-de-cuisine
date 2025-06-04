import { useLoaderData, Link } from "react-router";
import { assertIsRecipesResult } from "../types.tsx";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";

export function UserProfilePage() {
  const favs = useLoaderData();
  assertIsRecipesResult(favs);

  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUsername(
          decodedToken.username || decodedToken.name || decodedToken.sub
        );
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);
  // check favs received
  //   if (!isObject(favs)) {
  //     throw new Error("favs not an object");
  //   }
  //   if (!("favorites" in favs)) {
  //     throw new Error("no favorites property");
  //   }
  //   if (Array.isArray(favs.favorites)) {
  //     console.log("It's an array");
  //   } else {
  //     console.log("It's not an array");
  //   }
  //   const favorites = favs.favorites as number[];

  return (
    <>
      <div>
        <h2 className="text-left text-xl mt-3">User Profile for {username}</h2>
      </div>
      <h2 className="text-left text-xl mt-3">Favourite Recipes</h2>
      {favs.recipes.length === 0 ? (
        <p> No results</p>
      ) : (
        <ul className="text-left mt-3">
          {favs.recipes.map((result) => (
            <li key={result.id}>
              <h3>
                <Link to={`/recipes/${result.id}`} className="hover: underline">
                  {result.id}
                </Link>
              </h3>
              <p>{result.name}</p>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
