import { createBrowserRouter, RouterProvider } from "react-router";
import { SearchPage } from "./pages/SearchPage";
import { FilterPage } from "./pages/FilterPage";
import { RecipePage } from "./pages/RecipePage";
import App from "../App";
import { HomePage } from "./pages/HomePage";
import { SearchLayout } from "./layouts/SearchLayout";

//const baseurl = "http://localhost:5000";
const baseurl =
  "http://chefdecuisine-alb-1272383064.us-east-1.elb.amazonaws.com";
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
          const response = await fetch(`${baseurl}/api/v1/recipes/${id}`);
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
            const data: unknown = { recipes: [] };
            return data;
          }
          const response = await fetch(
            `${baseurl}/api/v1/recipes/search?query=${query}`
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
          const taste = url.searchParams.get("taste");
          const ingredient1 = url.searchParams.get("ingredient1");
          const ingredient2 = url.searchParams.get("ingredient2");
          const ingredient3 = url.searchParams.get("ingredient3");

          const ingredients: string[] = [];
          const params = new URLSearchParams();

          if (time) {
            params.append("time", time);
          }
          if (cuisine) {
            params.append("cuisine", cuisine);
          }
          if (taste) {
            params.append("taste", taste);
          }
          if (ingredient1) {
            ingredients.push(ingredient1);
          }
          if (ingredient2) {
            ingredients.push(ingredient2);
          }
          if (ingredient3) {
            ingredients.push(ingredient3);
          }
          if (ingredients.length != 0) {
            params.append("ingredients", ingredients.join(","));
          }

          const response = await fetch(
            `${baseurl}/api/v1/recipes/filter?${params.toString()}`
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
