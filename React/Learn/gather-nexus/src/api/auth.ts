import axios from "axios";

const API_URL = "https://sandboxgathernexusapi.azurewebsites.net/api/Authenticate/Login"; // Replace with your actual API

export const loginUser = async (email: string, password: string) => {
  return axios.post(`${API_URL}/login`, { email, password });
};

export const registerUser = async (data: any) => {
  return axios.post(`${API_URL}/register`, data);
};
