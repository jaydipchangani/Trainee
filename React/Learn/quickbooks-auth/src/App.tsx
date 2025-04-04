import React, { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [token, setToken] = useState<string | null>(null);

  // Function to extract query parameters from URL
  const getQueryParam = (param: string) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  };

  useEffect(() => {
    const authCode = getQueryParam("code"); // Get auth code from URL

    if (authCode) {
      axios
        .get(`https://localhost:7254/api/auth/callback?code=${authCode}`)
        .then((response) => {
          console.log("API Response:", response.data); // Debugging: Log response data

          const accessToken = response.data?.access_token;
          const refreshToken = response.data?.refresh_token;
          const expiresIn = response.data?.expires_in; // Token expiry time in seconds

          if (accessToken && refreshToken && expiresIn) {
            localStorage.setItem("quickbooks_access_token", accessToken);
            localStorage.setItem("quickbooks_refresh_token", refreshToken);
            localStorage.setItem(
              "quickbooks_token_expiry",
              (Date.now() + expiresIn * 1000).toString()
            );

            setToken(accessToken);
            console.log("Tokens saved successfully!");
          } else {
            console.error("Invalid token response structure:", response.data);
          }
        })
        .catch((error) => {
          console.error("Error fetching token:", error);
        });
    }
  }, []); // Ensure effect runs only once

  return (
    <div>
      <h1>QuickBooks OAuth Authentication</h1>
      {token ? (
        <p>✅ Connected to QuickBooks!</p>
      ) : (
        <a href="https://localhost:7254/api/auth/login">
          <button>Connect to QuickBooks</button>
        </a>
      )}
    </div>
  );
};

export default App;
