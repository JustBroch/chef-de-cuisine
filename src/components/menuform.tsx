import { useForm, type SubmitHandler } from "react-hook-form";

type Inputs = {
  example: string;
  exampleRequired: string;
};

export default function RecipeForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    getValues,
  } = useForm<Inputs>();

  const onSubmit = async () => {
    const data = getValues();
    const queryString = new URLSearchParams(data).toString();
    const url = `http://localhost:8080/api/v1/recipes?${queryString}`;

    try {
      const response = await fetch(url);
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  console.log(watch("example")); // watch input value by passing the name of it

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <form
      onSubmit={handleSubmit(onSubmit)}
      onError={() => {
        alert("Submission has failed.");
      }}
    >
      <div>
        <label htmlFor="recipeName">Recipe Name</label>
        <input
          className="border border-neutral-400 m-2 p-1"
          defaultValue="chicken soup"
          {...register("recipeName")}
        />
      </div>
      <div>
        <label htmlFor="ingredient1">Ingredient 1</label>
        <input
          className="border border-neutral-400 m-2 p-1"
          {...register("ingredient1")}
        />
      </div>
      <div>
        <label htmlFor="ingredient2">Ingredient 2</label>
        <input
          className="border border-neutral-400 m-2 p-1"
          {...register("ingredient2")}
        />
      </div>
      <div>
        <label htmlFor="ingredient3">Ingredient 3</label>
        <input
          className="border border-neutral-400 m-2 p-1"
          {...register("ingredient3")}
        />
      </div>

      {/* errors will return when field validation fails  */}
      {errors.exampleRequired && <span>This field is required</span>}
      <button className="bg-orange-400 m-2 p-2 rounded-md">Submit</button>
    </form>
  );
}
