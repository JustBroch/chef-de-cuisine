/**
 * @vitest-environment jsdom
 */

import { createRoutesStub } from "react-router";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { expect } from "vitest";
import { test } from "vitest";
import { FilterPage } from "../pages/FilterPage.tsx";
import { SearchLayout } from "../layouts/SearchLayout.tsx";

const baseurl =
  "http://chefdecuisine-alb-1272383064.us-east-1.elb.amazonaws.com";
// test to check filter page component displays received json correctly
// and time select works as expected. Real api call
test("app page", async () => {
  const user = userEvent.setup();

  const Stub = createRoutesStub([
    {
      Component: SearchLayout,
      children: [
        {
          path: "/recipes/filter",
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
  //await waitFor(() => screen.findByText("Pasta Carbonara"));
  await screen.findByText("Pasta Carbonara");
});
