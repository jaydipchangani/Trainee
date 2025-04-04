import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("Checking for OAuth token...");

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      // ✅ Print Token in Console
      console.log("🔑 Received OAuth Token:", token);

      // ✅ Validate Token Before Storing
      if (token.length < 10) {
        setError("Invalid token received from server.");
        console.error("❌ Invalid OAuth Token:", token);
        return;
      }

      // ✅ Store Token in LocalStorage
      localStorage.setItem("token", token);

      

      // ✅ Redirect to Dashboard
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = () => {
    window.location.href = "https://localhost:7106/api/auth/login";
  };

  return (
    <div>
      <h2>Login with Sandbox OAuth</h2>
      <button onClick={handleLogin}>Login</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Login;
