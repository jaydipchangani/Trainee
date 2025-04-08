import React, { useEffect, useState } from 'react';

const Dashboard = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const url = new URL(window.location.href);
    const tokenParam = url.searchParams.get("token");
    if (tokenParam) {
      setToken(decodeURIComponent(tokenParam));
    }
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      <p className="mt-4 text-gray-700">Token:</p>
      <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
        {token || "No token received"}
      </pre>
    </div>
  );
};

export default Dashboard;
