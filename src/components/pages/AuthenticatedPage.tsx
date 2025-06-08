import axios from "axios";
import { useEffect, useState } from "react";
import { User, Mail, Key, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

const baseurl = "http://chefdecuisine-alb-1272383064.us-east-1.elb.amazonaws.com";

export default function AuthenticatedPage() {
  const [message, setMessage] = useState("");
  const [user, setUser] = useState<{ id: number; username: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        
        if (!token) {
          setError("No authentication token found");
          setLoading(false);
          return;
        }

        const res = await axios.get(`${baseurl}/api/v1/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        setUser(res.data);
        setMessage("Successfully authenticated! Welcome to your protected page.");
        setLoading(false);
      } catch {
        setError("Authentication failed or token expired");
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Loading...</h1>
          <p className="text-gray-600">Verifying your authentication...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-red-100">
            <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-red-600 mb-2">Authentication Error</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <a
              href="/login"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 px-6 rounded-lg font-medium hover:from-orange-600 hover:to-amber-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Please log in to access this page
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-4">
      <div className="max-w-4xl mx-auto py-12">
        {/* Success Message */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-green-600">{message}</h1>
          </div>
        </div>

        {/* User Details Card */}
        {user && (
          <div className="bg-white rounded-2xl shadow-xl border border-orange-100 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6">
              <h2 className="text-2xl font-bold text-white mb-2">Your Profile</h2>
              <p className="text-orange-100">Welcome back to Chef de Cuisine!</p>
            </div>
            
            <div className="p-8">
              <div className="grid gap-6">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Username</p>
                    <p className="text-lg font-semibold text-gray-900">{user.username}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-lg font-semibold text-gray-900">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                    <Key className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">User ID</p>
                    <p className="text-lg font-semibold text-gray-900">{user.id}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-gray-600 text-center">
                  🍳 Ready to explore delicious recipes? 
                  <a href="/" className="text-orange-500 hover:text-orange-600 font-medium ml-1">
                    Start cooking!
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 