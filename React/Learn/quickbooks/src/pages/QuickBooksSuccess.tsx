import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const QuickBooksSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenJson = params.get("token");
    const realmId = params.get("realmId");

    if (tokenJson && realmId) {
      try {
        const decodedToken = JSON.parse(decodeURIComponent(tokenJson));
        localStorage.setItem("qb_access_token", decodedToken.access_token);
        localStorage.setItem("qb_refresh_token", decodedToken.refresh_token);
        localStorage.setItem("qb_realm_id", realmId);

        navigate("/dashboard");
      } catch (error) {
        console.error("Failed to parse token:", error);
      }
    }
  }, [location, navigate]);

  return (
    <div>
      <h1>Connected to QuickBooks!</h1>
      <p>Tokens stored in local storage. Redirecting to dashboard...</p>
    </div>
  );
};

export default QuickBooksSuccess;
