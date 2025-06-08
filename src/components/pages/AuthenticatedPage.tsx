import axios from "axios";
import { useEffect, useState } from "react";

const baseurl = "http://chefdecuisine-alb-1272383064.us-east-1.elb.amazonaws.com";

export default function AuthenticatedPage() {
  const [message, setMessage] = useState("");
  const [user, setUser] = useState<any>(null);
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
      } catch (err) {
        setError("Authentication failed or token expired");
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Loading...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Authentication Error</h1>
        <p className="text-red-500">{error}</p>
        <p className="mt-4">
          <a href="/login" className="text-blue-500 hover:underline">
            Please log in to access this page
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-green-600">{message}</h1>
      {user && (
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">User Details:</h2>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>User ID:</strong> {user.id}</p>
        </div>
      )}
    </div>
  );
} 