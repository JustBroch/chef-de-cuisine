import "./App.css";
import { Navbar1 } from "./components/navbar1";
import { Outlet } from "react-router";
import { Footer } from "@/components/footer";

export default function App() {
    return (
        <>
            <Navbar1 />
            <Outlet />
            <Footer />
        </>
    );
}
