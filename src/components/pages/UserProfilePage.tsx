import { useLoaderData, Link } from "react-router";

function isObject(value: unknown): value is object {
  return typeof value === "object" && value !== null;
}

export function UserProfilePage() {
  const { userDetails, favs } = useLoaderData();

  // check favs received
  if (!isObject(favs)) {
    throw new Error("favs not an object");
  }
  if (!("favorites" in favs)) {
    throw new Error("no favorites property");
  }
  if (Array.isArray(favs.favorites)) {
    console.log("It's an array");
  } else {
    console.log("It's not an array");
  }
  // check favs received
  if (!isObject(userDetails)) {
    throw new Error("userDetails not an object");
  }

  return (
    <>
      <div>
        <h2 className="text-left text-xl mt-5">User Profile:</h2>

        <p className="text-left  mt-3">Name: {userDetails.username}</p>
        <p className="text-left">Email: {userDetails.email}</p>
      </div>
      <h2 className="text-left text-xl mt-5">Favourite Recipes:</h2>
      {favs.favorites.length === 0 ? (
        <p> No results</p>
      ) : (
        <ul className="text-left mt-3">
          {favs.favorites.map((result) => (
            <li key={result.id}>
              <h3>
                <Link to={`/recipes/${result.id}`} className="hover: underline">
                  <p>{result.name}</p>
                </Link>
              </h3>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
