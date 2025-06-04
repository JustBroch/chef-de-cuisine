import axios from "axios";
import { useEffect, useState } from "react";

export default function ProtectedPage() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProtected = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/protected", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage(res.data.message);
    };
    fetchProtected();
  }, []);

  return <h1>{message}</h1>;
}