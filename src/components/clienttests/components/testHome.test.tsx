/**
 * @vitest-environment jsdom
 */

import { createRoutesStub } from "react-router";
import { render, screen, waitFor } from "@testing-library/react";
import App from "../../../App.tsx";
import { HomePage } from "../../pages/HomePage.tsx";
import { test } from "vitest";

/*
Test to check home page component renders properly
*/

test("app page", async () => {
  const Stub = createRoutesStub([
    {
      path: "/",
      Component: App,
      children: [
        {
          index: true,
          Component: HomePage,
        },
      ],
    },
  ]);

  // render the app stub at "/"
  render(<Stub initialEntries={["/"]} />);

  // simulate interactions
  await waitFor(() => screen.findByText("Home"));
});
