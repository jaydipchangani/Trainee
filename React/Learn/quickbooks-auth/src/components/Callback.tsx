// src/components/Callback.tsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Get the query parameters from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get("code");
    const realmId = urlParams.get("realmId");

    if (authCode && realmId) {
      // Make the request to the backend to exchange the code for a token
      axios
        .get(`https://localhost:7254/api/auth/callback?code=${authCode}&realmId=${realmId}`)
        .then((response) => {
          const { access_token, refresh_token, expires_in } = response.data;

          // Save the tokens in localStorage
          if (access_token && refresh_token && expires_in) {
            localStorage.setItem("quickbooks_access_token", access_token);
            localStorage.setItem("quickbooks_refresh_token", refresh_token);
            localStorage.setItem("quickbooks_token_expiry", (Date.now() + expires_in * 1000).toString());
            localStorage.setItem("quickbooks_realm_id", realmId);

            // Redirect to the dashboard
            navigate("/");  // Redirect to dashboard
          }
        })
        .catch((error) => {
          console.error("Error during token exchange:", error);
        });
    } else {
      console.error("Missing code or realmId in the URL");
    }
  }, [navigate]);

  return <div>Loading...</div>;
};

export default Callback;
