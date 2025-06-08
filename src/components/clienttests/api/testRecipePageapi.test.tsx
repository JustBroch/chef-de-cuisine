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
Test to check individual recipe renders ok with real api
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
            const recipeResponse = await fetch(
              `${baseurl}/api/v1/recipes/${id}`
            );
            const recipe = (await recipeResponse.json()) as unknown;
            return { recipe };
          },
        },
      ],
    },
  ]);

  render(<Stub initialEntries={["/recipes/182"]} />);

  await waitFor(() => screen.findByText("Pasta Carbonara"), {
    timeout: 5000,
    interval: 100,
  });
});
