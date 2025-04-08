import React, { useEffect } from "react";
import axios from "axios";
import { Button } from "antd";

const OAuthLogin = ({ setToken, setRealmId }: { setToken: React.Dispatch<React.SetStateAction<string | null>>, setRealmId: React.Dispatch<React.SetStateAction<string | null>> }) => {
  useEffect(() => {
    const authCode = new URLSearchParams(window.location.search).get("code");
    const realmIdFromUrl = new URLSearchParams(window.location.search).get("realmId");

    if (realmIdFromUrl) setRealmId(realmIdFromUrl);

    if (authCode) {
      axios
        .get(`https://localhost:7254/api/auth/callback?code=${authCode}`)
        .then((response) => {
          const { access_token, refresh_token, expires_in } = response.data;
          if (access_token && refresh_token && expires_in) {
            localStorage.setItem("quickbooks_access_token", access_token);
            localStorage.setItem("quickbooks_refresh_token", refresh_token);
            localStorage.setItem("quickbooks_token_expiry", (Date.now() + expires_in * 1000).toString());
            localStorage.setItem("quickbooks_realm_id", realmIdFromUrl || "");
            setToken(access_token);
          }
        })
        .catch((error) => console.error("Error fetching token:", error));
    }
  }, [setToken, setRealmId]);

  return (
    <div style={{ marginTop: "2rem", textAlign: "center" }}>
      <a href="https://localhost:7254/api/auth/login">
        <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
          <Button
            type="primary"
            size="large"
            style={{ backgroundColor: "#4CAF50", borderColor: "#4CAF50" }}
          >
            Connect to QuickBooks
          </Button>
        </div>
      </a>
    </div>
  );
};

export default OAuthLogin;
