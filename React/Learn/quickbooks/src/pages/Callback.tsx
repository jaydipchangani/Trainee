import ColumnGroup from 'antd/es/table/ColumnGroup';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const Callback = () => {
    const [searchParams]=useSearchParams();

    useEffect(() => {
        const code = searchParams.get("code");
        const state = searchParams.get("state");
        const realmId = searchParams.get("realmId");
    
        if (code && state && realmId) {
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
                }),
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
    <div className="p-6">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      <p className="mt-4 text-gray-700">Token:</p>
      
    </div>
  );
};

export default Callback;
