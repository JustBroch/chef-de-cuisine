/**
 * @vitest-environment jsdom
 */

import { createRoutesStub } from "react-router";
import { render, screen, waitFor } from "@testing-library/react";

import App from "../../App.tsx";
import { test } from "vitest";

// test to check home page component renders properly
test("app page", async () => {
  const heading = "Chef de Cuisine";

  const Stub = createRoutesStub([
    {
      path: "/",
      Component: App,
    },
  ]);

  // render the app stub at "/"
  render(<Stub initialEntries={["/"]} />);

  // simulate interactions
  await waitFor(() => screen.findByText(heading));
});
