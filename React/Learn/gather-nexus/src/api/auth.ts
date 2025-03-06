import axios from "axios";

const API_BASE_URL = "https://sandboxgathernexusapi.azurewebsites.net/api/Authenticate";

export const registerUser = async (userData: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/Register`, userData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("API Registration Error:", error.response?.data || error.message);
    throw error;
  }
};
