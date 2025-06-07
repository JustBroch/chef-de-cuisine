/**
 * @vitest-environment jsdom
 */

import { createRoutesStub } from "react-router";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { expect } from "vitest";
import { test } from "vitest";
import { FilterPage } from "../../pages/FilterPage.tsx";
import { SearchLayout } from "../../layouts/SearchLayout.tsx";

/*
Test to check filter page component displays received json correctly
 Api call is mocked
*/

test("app page", async () => {
  const user = userEvent.setup();

  const Stub = createRoutesStub([
    {
      Component: SearchLayout,
      children: [
        {
          path: "/recipes/filter",
          Component: FilterPage,
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

  // render the app stub
  render(<Stub initialEntries={["/recipes/filter"]} />);

  // check initial render
  await waitFor(() => screen.findByText("Pasta Carbonara"));

  // select option
  await user.selectOptions(
    screen.getByRole("combobox", { name: "Cooking Time:" }),
    "30"
  );

  // check selected
  expect(screen.getByRole("option", { name: "30 mins" }).selected).toBe(true);

  // press filter button which will reload the page with data received from mocked api call
  const filterButton = screen.getByRole("button", { name: "Apply Filters" });
  await waitFor(() => userEvent.click(filterButton));

  // check recipe in loader results
  await waitFor(() => screen.findByText("Pasta Carbonara"));
});
