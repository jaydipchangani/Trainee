import axios from "axios";

export const loginUser = async (email: string, password: string) => {
  try {
    const res = await axios.post("http://localhost:5000/login", { email, password });
    return res.data;
  } catch (err) {
    return null;
  }
};
