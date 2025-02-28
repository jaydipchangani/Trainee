import axios from "axios";

const API_URL = "http://localhost:5000/permissions";

export const fetchPermissions = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const updatePermissions = async (role: string, permissions: string[]) => {
  const response = await axios.patch(`${API_URL}/${role}`, { permissions });
  return response.data;
};
