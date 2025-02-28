import axios from "axios";

const API_URL = "http://localhost:5000/users";

export const fetchUsers = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const addUser = async (userData: any) => {
  const response = await axios.post(API_URL, userData);
  return response.data;
};

export const updateUser = async (id: number, updatedUser: any) => {
  const response = await axios.put(`${API_URL}/${id}`, updatedUser);
  return response.data;
};

export const deleteUser = async (id: number) => {
  await axios.delete(`${API_URL}/${id}`);
};
