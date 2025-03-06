import axios from "axios";

const API_BASE_URL = "https://sandboxgathernexusapi.azurewebsites.net/api/Authenticate";

export const loginUser = async (email: string, password: string) => {
    return axios.post(`${API_BASE_URL}/login`, { email, password });
  };

export const registerUser = async (userData: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/Register`, userData, {
      headers: {
        "Content-Type": "application/json",
      },

    });

    console.log("API Registration Response:", response.data); // Debugging
    return response.data;
  } catch (error) {
    console.error("API Registration Error:", error.response?.data || error.message);
    throw error;
  }
};
