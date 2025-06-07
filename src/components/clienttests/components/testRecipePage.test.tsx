/**
 * @vitest-environment jsdom
 */

import { createRoutesStub } from "react-router";
import { render, screen, waitFor } from "@testing-library/react";

import App from "../../../App.tsx";
import { RecipePage } from "../../pages/RecipePage.tsx";
import { test } from "vitest";

/*
Test to check individual recipe component renders ok. 
Mocks backend api
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
          loader() {
            return {
              recipe: {
                id: 1,
                image_url: null,
                name: "Pasta Carbonara",
                description: "Classic Italian pasta dish...",
                time: 30,
                cuisine: "Italian",
                difficulty: "medium",
                tools: ["pan", "pot", "whisk"],
                ingredients: ["pasta", "eggs", "parmesan", "pancetta"],
                taste: ["savory", "creamy", "rich"],
              },
            };
          },
        },
      ],
    },
  ]);

  // render the app stub at "/"
  render(<Stub initialEntries={["/recipes/1"]} />);

  // simulate interactions
  await waitFor(() => screen.findByText("Pasta Carbonara"));
});
