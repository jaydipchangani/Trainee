import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const Login = () => {
  const handleLogin = () => {
    window.location.href = "https://localhost:7168/api/auth/login";
  };

  const [searchParams]=useSearchParams();

  useEffect(() => {

    console.log("here")
      const code = searchParams.get("code");
      const state = searchParams.get("state");
      const realmId = searchParams.get("realmId");
  
      if (code && state && realmId) {
        console.log("Code:", code);
        const fetchToken = async () => {
          try {
            const response = await fetch("https://localhost:7168/api/Auth/callback", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                code,
                state,
                realmId,
              })
        

            });
  
            const data = await response.json();
            console.log("Token response:", data);
  
            // Save tokens in localStorage
            localStorage.setItem("access_token", data.access_token);
            localStorage.setItem("refresh_token", data.refresh_token);

          } catch (error) {
            console.error("Error during token exchange:", error);
          }
        };
  
        fetchToken();
      }
    }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">QuickBooks OAuth Demo</h1>
        <button
          onClick={handleLogin}
          className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded text-white font-semibold"
        >
          Login with QuickBooks
        </button>
      </div>
    </div>
  );
};

export default Login;
