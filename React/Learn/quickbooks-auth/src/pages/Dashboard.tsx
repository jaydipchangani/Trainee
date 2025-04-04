import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("qb_token");

    if (!token) {
      navigate("/"); // ✅ Redirect to login if not authenticated
    }
  }, [navigate]);

  return (
    <div>
      <h1>Welcome to the Dashboard</h1>
      <button onClick={() => { localStorage.removeItem("qb_token"); navigate("/"); }}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
