import axios from "axios";
import { getToken } from "./storage";

export const setToken = (token: string, userId: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
  };
  
  export const getToken = () => localStorage.getItem("token");
  
  export const removeToken = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
  };
  
  export const fetchCurrencies = async () => {
    try {
      const token = getToken();
      const response = await axios.get("https://api.example.com/currencies", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching currencies:", error);
      return [];
    }
  };
  
  export const fetchCompanies = async () => {
    try {
      const token = getToken();
      const response = await axios.get("https://api.example.com/companies", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching companies:", error);
      return [];
    }
  };