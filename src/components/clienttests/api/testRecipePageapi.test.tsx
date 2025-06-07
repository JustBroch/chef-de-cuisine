/**
 * @vitest-environment jsdom
 */

import { createRoutesStub } from "react-router";
import { render, screen, waitFor } from "@testing-library/react";

import App from "../../../App.tsx";
import { RecipePage } from "../../pages/RecipePage.tsx";
import { test } from "vitest";
const baseurl =
  "http://chefdecuisine-alb-1272383064.us-east-1.elb.amazonaws.com";

/*
Test to check individual recipe renders ok
*/
test("app page", async () => {
  const Stub = createRoutesStub([
    {
      path: "/",
      Component: App,
      children: [
        {
          path: "recipes/:id",
          Component: RecipePage,
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
        },
      ],
    },
  ]);

  render(<Stub initialEntries={["/recipes/1"]} />);

  await waitFor(() => screen.findByText("Pasta Carbonara"), {
    timeout: 5000,
    interval: 100,
  });
});
