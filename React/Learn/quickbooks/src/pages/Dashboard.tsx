import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    console.log("Current URL:", window.location.href); // Debug log

    if (token) {
      localStorage.setItem("quickbooks_token", token);
      console.log("Token saved to localStorage:", token);

      // Clean the URL after saving token
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const savedToken = localStorage.getItem("quickbooks_token");

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Token: {savedToken || "No token received"}</p>
    </div>
  );
};

export default Dashboard;
