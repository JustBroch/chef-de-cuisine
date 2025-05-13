import "./App.css";
import { Navbar1 } from "./components/navbar1";
import image from "./assets/image.jpg";

function App() {
    return (
        <>
            <Navbar1 />
            <div>
                <img src={image} alt="Food image" />{" "}
            </div>
        </>
    );
}

export default App;
