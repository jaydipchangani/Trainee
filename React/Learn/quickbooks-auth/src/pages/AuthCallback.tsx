import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleAuthCallback = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get("code");

            if (!code) {
                console.error("Authorization code is missing");
                return;
            }

            try {
                const response = await fetch("http://localhost:7254/api/auth/callback", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ code }),
                });

                const data = await response.json();

                if (response.ok) {
                    console.log("Token received:", data.accessToken);
                    
                    // ✅ Store tokens in localStorage
                    localStorage.setItem("accessToken", data.accessToken);
                    localStorage.setItem("refreshToken", data.refreshToken);
                    localStorage.setItem("expiresIn", data.expiresIn.toString());

                    // Redirect to dashboard after storing token
                    navigate("/dashboard");
                } else {
                    console.error("Error:", data.message);
                }
            } catch (error) {
                console.error("Request failed", error);
            }
        };

        handleAuthCallback();
    }, [navigate]); // Runs once when the component mounts

    return <h2>Authenticating...</h2>;
};

export default AuthCallback;
