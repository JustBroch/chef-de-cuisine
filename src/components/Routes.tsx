import { createBrowserRouter, RouterProvider } from "react-router";
import { RecipesPage } from "./pages/RecipesPage";
import App from "../App";
import { HomePage } from "./pages/HomePage";

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      {
        index: true,

        Component: HomePage,
      },
      {
        path: "recipes",
        Component: RecipesPage,
        loader: async ({ request }: { request: Request }) => {
          const url = new URL(request.url);
          const query = url.searchParams.get("q");
          // if (!query) {
          //   return { results: [] }; // Return empty results if no search term
          //}
          const response = await fetch(
            `https://dummyjson.com/recipes/search?q=${query}`
          );
          const data = (await response.json()) as unknown;
          console.log(data);

          return data;
        },
      },
    ],
  },
]);

export function Routes() {
  return <RouterProvider router={router} />;
}
