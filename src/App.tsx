import "./App.css";
import { Navbar1 } from "./components/navbar1";
import image from "./assets/image.jpg";
import RecipeForm from "./components/menuform";

function App() {
  return (
    <>
      <Navbar1 />
      <RecipeForm />
      <div>
        <img src={image} alt="Food image" />{" "}
      </div>
    </>
  );
}

export default App;
