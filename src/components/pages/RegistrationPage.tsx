import { useForm, type FieldError } from "react-hook-form";
import { useNavigate, useSubmit } from "react-router";
import { ValidationError } from "./ValidationError";

type Registration = {
  password: string;
  username: string;
  email: string;
};

export function RegistrationPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Registration>();
  const navigate = useNavigate();
  const submit = useSubmit();

  const onSubmit = (registration: Registration) => {
    submit(registration, { method: "post" });
    navigate("/login");
  };

  function getEditorStyle(fieldError: FieldError | undefined) {
    return fieldError
      ? "border-red-500 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      : "text-gray-600 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";
  }

  return (
    <>
      <h2 className="ml-3 mb-3 text-left">Sign Up</h2>
      <div className="text-left">
        <form noValidate onSubmit={handleSubmit(onSubmit)} method="post">
          <div className="ml-3">
            <label
              htmlFor="username"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Username:{" "}
            </label>
            <input
              className={getEditorStyle(errors.username)}
              type="text"
              id="username"
              {...register("username", { required: "Username required" })}
            />
            <ValidationError fieldError={errors.username} />
          </div>
          <div className="ml-3">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Email:{" "}
            </label>
            <input
              className={getEditorStyle(errors.email)}
              type="text"
              id="email"
              {...register("email", { required: "Emailrequired" })}
            />
            <ValidationError fieldError={errors.email} />
          </div>
          <div className="ml-3">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Password:
            </label>
            <input
              className={getEditorStyle(errors.password)}
              type="password"
              id="password"
              {...register("password", { required: "Password required" })}
            />

            <ValidationError fieldError={errors.password} />
            <div>
              <button
                type="submit"
                className=" rounded-md ml-3 mt-2 h-10 px-6 font-semibold bg-black         text-white"
              >
                Register
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
