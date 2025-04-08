import React from 'react';

const Login = () => {
  const handleLogin = () => {
    window.location.href = "https://localhost:7168/api/auth/login";
  };

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
