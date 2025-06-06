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
const baseurl =
  "http://chefdecuisine-alb-1272383064.us-east-1.elb.amazonaws.com";
// test to check search page component displays received json correctly. Real api call
test("app page", async () => {
  const user = userEvent.setup();

  const Stub = createRoutesStub([
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
