import React, { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [token, setToken] = useState<string | null>(null);
  const [realmId, setRealmId] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<any[]>([]);

  // Function to extract query parameters from URL
  const getQueryParam = (param: string) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  };

  useEffect(() => {
    const authCode = getQueryParam("code");
    const realmIdFromUrl = getQueryParam("realmId");

    if (realmIdFromUrl) {
      setRealmId(realmIdFromUrl);
    }

    if (authCode) {
      axios
        .get(`https://localhost:7254/api/auth/callback?code=${authCode}`)
        .then((response) => {
          console.log("API Response:", response.data);

          const accessToken = response.data?.access_token;
          const refreshToken = response.data?.refresh_token;
          const expiresIn = response.data?.expires_in;

          if (accessToken && refreshToken && expiresIn) {
            localStorage.setItem("quickbooks_access_token", accessToken);
            localStorage.setItem("quickbooks_refresh_token", refreshToken);
            localStorage.setItem(
              "quickbooks_token_expiry",
              (Date.now() + expiresIn * 1000).toString()
            );
            localStorage.setItem("quickbooks_realm_id", realmIdFromUrl || "");

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
  }, []);

  // Fetch QuickBooks Accounts
  const fetchAccounts = () => {
    const savedToken = localStorage.getItem("quickbooks_access_token");
    const savedRealmId = localStorage.getItem("quickbooks_realm_id");

    if (!savedToken || !savedRealmId) {
      console.error("Access Token or Realm ID is missing!");
      return;
    }

    axios
      .get(`https://localhost:7254/api/quickbooks/accounts`, {
        params: { accessToken: savedToken, realmId: savedRealmId },
      })
      .then((response) => {
        console.log("QuickBooks Accounts:", response.data);
        setAccounts(response.data.QueryResponse.Account || []);
      })
      .catch((error) => {
        console.error("Error fetching accounts:", error.response?.data || error);
      });
};

  return (
    <div>
      <h1>QuickBooks OAuth Authentication</h1>
      {token ? (
        <>
          <p>✅ Connected to QuickBooks!</p>
          <button onClick={fetchAccounts}>Fetch QuickBooks Accounts</button>
          <ul>
            {accounts.map((account) => (
              <li key={account.Id}>{account.Name} - {account.AccountType}</li>
            ))}
          </ul>
        </>
      ) : (
        <a href="https://localhost:7254/api/auth/login">
          <button>Connect to QuickBooks</button>
        </a>
      )}
    </div>
  );
};

export default App;
