import "./App.css";
import { Navbar } from "./components/navbar";
import { Outlet } from "react-router";
import { Footer } from "@/components/footer";

export default function App() {
    return (
        <>
            <Navbar />
            <Outlet />
            <Footer />
        </>
    );
}
