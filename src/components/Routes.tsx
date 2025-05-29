import { createBrowserRouter, RouterProvider } from "react-router";
import { SearchPage } from "./pages/SearchPage";
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
        path: "search",
        Component: SearchPage,
        loader: async ({ request }: { request: Request }) => {
          const url = new URL(request.url);
          const query = url.searchParams.get("q");
          // Return empty results if no search term
          if (!query) {
            const data: unknown = [];
            return data;
          }
          const response = await fetch(
            `http://localhost:3001/recipes?name_like=${query}`
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
