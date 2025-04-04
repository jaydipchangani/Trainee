import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");
  
    if (code) {
      console.log(`🔄 OAuth Callback Handling...`);
      console.log(`🔑 Received OAuth Code: ${code}`);
      console.log(`📡 Sending request to backend...`);
  
      axios
        .get(`https://localhost:7106/api/auth/callback?code=${code}&state=${state}`)
        .then((res) => {
          console.log(`✅ OAuth Success:`, res.data);
          localStorage.setItem("token", res.data.accessToken);
        })
        .catch((err) => {
          console.error(`❌ OAuth Token Exchange Failed:`, err);
        });
    }
  }, []);
  
  return <h2>Processing OAuth login...</h2>;
};

export default Callback;
