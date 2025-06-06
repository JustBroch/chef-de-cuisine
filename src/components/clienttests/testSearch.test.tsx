/**
 * @vitest-environment jsdom
 */

import { createRoutesStub } from "react-router";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { expect } from "vitest";
import { test } from "vitest";
import { SearchLayout } from "../layouts/SearchLayout.tsx";
import { SearchPage } from "../pages/SearchPage.tsx";

// test to check search page component displays received json correctly. Api call is mocked
test("app page", async () => {
  const user = userEvent.setup();

  const Stub = createRoutesStub([
    {
      Component: SearchLayout,
      children: [
        {
          path: "recipes/search",
          Component: SearchPage,
          loader() {
            return {
              recipes: [
                {
                  cuisine: "Italian",
                  description:
                    "Classic Italian pasta dish with eggs, cheese, and pancetta",
                  difficulty: "medium",
                  id: 1,
                  image_url: null,
                  ingredients: [
                    "pasta",
                    "eggs",
                    "parmesan",
                    "pancetta",
                    "black pepper",
                  ],
                  name: "Pasta Carbonara",
                  taste: ["savory", "creamy", "rich"],
                  time: 30,
                  tools: ["pan", "pot", "whisk"],
                },
              ],
            };
          },
        },
      ],
    },
  ]);

  // render the app stub at "/"
  render(<Stub initialEntries={["/recipes/search"]} />);

  await waitFor(() => screen.getByPlaceholderText("search"));
  const searchInput = screen.getByPlaceholderText("search");
  await waitFor(() => user.type(searchInput, "pasta"));
  expect(searchInput.value).toBe("pasta");

  const searchButton = screen.getByRole("button", { name: /search/i });
  await waitFor(() => userEvent.click(searchButton));

  // simulate interactions
  await waitFor(() => screen.findByText("Pasta Carbonara"));
});
