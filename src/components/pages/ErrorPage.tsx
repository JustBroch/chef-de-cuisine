import { useRouteError } from "react-router";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

export function ErrorPage() {
  const error = useRouteError();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-orange-100">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-10 h-10 text-orange-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Oops! Something went wrong
            </h1>
            <p className="text-gray-600">
              We're sorry, but something unexpected happened. Don't worry, it's not your fault!
            </p>
          </div>

          {isError(error) && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <p className="text-orange-800 font-medium text-sm">
                {error.statusText}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => window.location.reload()}
              className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 px-4 rounded-lg font-medium hover:from-orange-600 hover:to-amber-600 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
            <a
              href="/"
              className="flex-1 bg-white text-orange-600 py-3 px-4 rounded-lg font-medium border-2 border-orange-200 hover:bg-orange-50 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Go Home
            </a>
          </div>
        </div>
        
        <p className="text-gray-500 text-sm mt-6">
          If this problem persists, please contact our support team.
        </p>
      </div>
    </div>
  );
}

function isError(error: unknown): error is { statusText: string } {
  return typeof error === "object" && error !== null && "statusText" in error;
}
