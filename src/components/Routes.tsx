import { createBrowserRouter, RouterProvider } from "react-router";
import { SearchPage } from "./pages/SearchPage";
import { FilterPage } from "./pages/FilterPage";
import { RecipePage } from "./pages/RecipePage";
import App from "../App";
import { HomePage } from "./pages/HomePage";
import { SearchLayout } from "./layouts/SearchLayout";

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
        path: "recipes/:id",
        Component: RecipePage,
        loader: async ({ params }) => {
          const { id } = params;
          // `${baseurl}/api/v1/recipes/${id}`
          const response = await fetch(`http://localhost:3001/recipes/${id}/`);
          const data = (await response.json()) as unknown;
          return data;
        },
      },
    ],
  },
  {
    Component: SearchLayout,
    children: [
      {
        path: "recipes/search",
        Component: SearchPage,
        loader: async ({ request }: { request: Request }) => {
          const url = new URL(request.url);
          const query = url.searchParams.get("query");
          // Return empty results if no search term
          if (!query) {
            const data: unknown = [];
            return data;
          }
          const response = await fetch(
            //`${baseurl}/api/v1/recipes/search?query=${query}`
            `http://localhost:3001/recipes?name_like=${query}`
          );
          const data = (await response.json()) as unknown;
          return data;
        },
      },
      {
        path: "recipes/filter",
        Component: FilterPage,
        loader: async ({ request }: { request: Request }) => {
          const url = new URL(request.url);
          const time = url.searchParams.get("time");
          const cuisine = url.searchParams.get("cuisine");
          const ingredient1 = url.searchParams.get("ingredient1");
          const ingredient2 = url.searchParams.get("ingredient2");
          const ingredient3 = url.searchParams.get("ingredient3");

          const response = await fetch(
            //`${baseurl}/api/v1/recipes/search?query=${query}`
            `http://localhost:3001/recipes?total_time_like=${time}&ingredients_like=${ingredient1}&cuisine_path_like=${cuisine}`
          );
          const data = (await response.json()) as unknown;
          return data;
        },
      },
    ],
  },
]);

export function Routes() {
  return <RouterProvider router={router} />;
}
