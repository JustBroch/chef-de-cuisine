import {
  createBrowserRouter,
  redirect,
  RouterProvider,
  useNavigate,
} from "react-router";
import { SearchPage } from "./pages/SearchPage";
import { FilterPage } from "./pages/FilterPage";
import { RecipePage } from "./pages/RecipePage";
import { LoginPage } from "./pages/LoginPage";
import { RegistrationPage } from "./pages/RegistrationPage";
import { UserProfilePage } from "./pages/UserProfilePage";
import App from "../App";
import { HomePage } from "./pages/HomePage";
import { SearchLayout } from "./layouts/SearchLayout";
import { ErrorPage } from "./pages/ErrorPage";

const baseurl =
  "http://chefdecuisine-alb-1272383064.us-east-1.elb.amazonaws.com";
const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        Component: HomePage,
      },

      {
        path: "register",
        Component: RegistrationPage,
        action: async ({ request }) => {
          const formData = await request.formData();

          const registration = Object.fromEntries(formData);
          console.log(registration);
          const username = registration.username;
          const email = registration.email;
          const password = registration.password;
          const regHeaders = new Headers();
          regHeaders.append("Content-Type", "application/json");
          await fetch(`${baseurl}/api/v1/auth/register`, {
            method: "POST",
            body: JSON.stringify({
              username: `${username}`,
              email: `${email}`,
              password: `${password}`,
            }),
            headers: regHeaders,
          });
          return redirect("/login");
        },
      },
      {
        path: "user/",
        Component: UserProfilePage,
        errorElement: <ErrorPage />,
        loader: async () => {
          const token = localStorage.getItem("jwtToken");

          // set headers to get users favourites
          const favHeaders = new Headers();
          favHeaders.append("Authorization", `Bearer ${token}`);

          // get recipe details and users favourites
          const [userResponse, favResponse] = await Promise.all([
            fetch(`${baseurl}/api/v1/users/me`, {
              method: "GET",
              headers: favHeaders,
            }),
            fetch(`${baseurl}/api/v1/favorites`, {
              method: "GET",
              headers: favHeaders,
            }),
          ]);

          // receive response
          const userDetails = (await userResponse.json()) as unknown;
          const favs = (await favResponse.json()) as unknown;

          return { userDetails, favs };
        },
      },
      {
        path: "recipes/:id",
        Component: RecipePage,
        errorElement: <ErrorPage />,
        loader: async ({ params }) => {
          const { id } = params;

          const token = localStorage.getItem("jwtToken");

          // set headers to get users favourites
          const favHeaders = new Headers();
          favHeaders.append("Authorization", `Bearer ${token}`);

          if (token) {
            // get recipe details and users favourites
            const [recipeResponse, favResponse] = await Promise.all([
              fetch(`${baseurl}/api/v1/recipes/${id}`),
              fetch(`${baseurl}/api/v1/favorites`, {
                method: "GET",
                headers: favHeaders,
              }),
            ]);
            // receive response
            const recipe = (await recipeResponse.json()) as unknown;
            const favs = (await favResponse.json()) as unknown;

            return { recipe, favs };
          } else {
            // user not logged in
            const recipeResponse = await fetch(
              `${baseurl}/api/v1/recipes/${id}`
            );
            const recipe = (await recipeResponse.json()) as unknown;
            return { recipe };
          }
        },
        action: async ({ request }) => {
          const formData = await request.formData();

          // get recipe to add or remove and action to remove or add favorite
          const recipeId = formData.get("recipeId");
          const action = formData.get("action");
          const token = localStorage.getItem("jwtToken");

          const favHeaders = new Headers();

          // Logic to add/remove favorite
          if (action === "add") {
            favHeaders.append("Authorization", `Bearer ${token}`);
            favHeaders.append("Content-Type", "application/json");
            await fetch(`${baseurl}/api/v1/favorites`, {
              method: "POST",
              body: JSON.stringify({ recipe_id: `${recipeId}` }),
              headers: favHeaders,
            });
          } else if (action === "remove") {
            favHeaders.append("Authorization", `Bearer ${token}`);
            await fetch(`${baseurl}/api/v1/favorites/${recipeId}`, {
              method: "DELETE",
              headers: favHeaders,
            });
          }
          return null;
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
        errorElement: <ErrorPage />,
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
        errorElement: <ErrorPage />,
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
      {
        path: "login",
        Component: LoginPage,
        action: async ({ request }) => {
          const formData = await request.formData();
          const login = Object.fromEntries(formData);
          const username = login.username;
          const password = login.password;
          const loginHeaders = new Headers();
          loginHeaders.append("Content-Type", "application/json");
          const response = await fetch(`${baseurl}/api/v1/auth/login`, {
            method: "POST",
            body: JSON.stringify({
              username: `${username}`,
              password: `${password}`,
            }),
            headers: loginHeaders,
          });
          const data = (await response.json()) as unknown;
          console.log(data);
          if (data.access_token) {
            localStorage.setItem("jwtToken", data.access_token);
          }
          if (data.message == "Login successful") {
            console.log("success");
            return redirect("/");
          }
          return data;
        },
      },
    ],
  },
]);

export function Routes() {
  return <RouterProvider router={router} />;
}
