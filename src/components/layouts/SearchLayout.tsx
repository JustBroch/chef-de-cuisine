import { Navbar } from "../navbar";
import { Footer } from "../footer";
import { Outlet } from "react-router";

export function SearchLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}
