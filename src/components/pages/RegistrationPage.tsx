import { useForm, type FieldError } from "react-hook-form";
import { useNavigate, useSubmit, Link } from "react-router";
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
    formState: { errors, isSubmitting },
  } = useForm<Registration>();
  const navigate = useNavigate();
  const submit = useSubmit();

  const onSubmit = (registration: Registration) => {
    submit(registration, { method: "post" });
    navigate("/login");
  };

  function getInputStyle(fieldError: FieldError | undefined) {
    const baseStyle = "w-full pl-12 pr-4 py-3 text-gray-900 placeholder-gray-500 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200";
    return fieldError
      ? `${baseStyle} border-red-300 focus:border-red-500 focus:ring-red-500/20 bg-red-50`
      : `${baseStyle} border-gray-300 focus:border-orange-500 focus:ring-orange-500/20 bg-white hover:border-gray-400`;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create account</h2>
          <p className="text-gray-600">Join Chef de Cuisine and start cooking</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form noValidate onSubmit={handleSubmit(onSubmit)} method="post" className="space-y-6">
            {/* Username Field */}
            <div>
            <label
              htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-2"
            >
                Username
            </label>
              <div className="relative">
            <input
                  className={getInputStyle(errors.username)}
              type="text"
              id="username"
                  placeholder="Choose a username"
                  {...register("username", { 
                    required: "Username is required",
                    minLength: { value: 3, message: "Username must be at least 3 characters" },
                    pattern: { value: /^[a-zA-Z0-9_]+$/, message: "Username can only contain letters, numbers, and underscores" }
                  })}
            />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            <ValidationError fieldError={errors.username} />
          </div>

            {/* Email Field */}
            <div>
            <label
              htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
            >
                Email
            </label>
              <div className="relative">
            <input
                  className={getInputStyle(errors.email)}
                  type="email"
              id="email"
                  placeholder="Enter your email"
                  {...register("email", { 
                    required: "Email is required",
                    pattern: { 
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 
                      message: "Please enter a valid email address" 
                    }
                  })}
            />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
              </div>
            <ValidationError fieldError={errors.email} />
          </div>

            {/* Password Field */}
            <div>
            <label
              htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
            >
                Password
            </label>
              <div className="relative">
            <input
                  className={getInputStyle(errors.password)}
              type="password"
              id="password"
                  placeholder="Create a password"
                  {...register("password", { 
                    required: "Password is required",
                    minLength: { value: 6, message: "Password must be at least 6 characters" },
                    pattern: { 
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message: "Password must contain at least one uppercase letter, one lowercase letter, and one number"
                    }
                  })}
            />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
            <ValidationError fieldError={errors.password} />
            </div>

            {/* Submit Button */}
              <button
                type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all duration-200"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </div>
              ) : (
                "Create Account"
              )}
              </button>

            {/* Login Link */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-orange-600 hover:text-orange-500 transition-colors duration-200"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
          </div>
      </div>
    </div>
  );
}
