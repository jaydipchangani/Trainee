import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("❌ No token found, redirecting to login...");
      navigate("/login");
      return;
    }

    // ✅ Print Token in Console
    console.log("✅ User is logged in with token:", token);
  }, [navigate]);

  return (
    <div>
      <h2>Welcome to Dashboard</h2>
      <p>You are successfully logged in!</p>
      <button
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/login");
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
