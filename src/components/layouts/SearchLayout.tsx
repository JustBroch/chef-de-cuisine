import { Navbar1 } from "../navbar1";
import { Outlet } from "react-router";

export function SearchLayout() {
  return (
    <>
      <Navbar1 />
      <Outlet />
    </>
  );
}
