import axios from "axios";

export const registerUser = async (user: { username: string; password: string }) => {
  return await axios.post("http://localhost:5000/users", user);
};

export const loginUser = async (username: string, password: string) => {
  const { data } = await axios.get("http://localhost:5000/users");
  return data.find((user: any) => user.username === username && user.password === password);
};
