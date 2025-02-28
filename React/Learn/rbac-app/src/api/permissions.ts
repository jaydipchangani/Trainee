import axios from "axios";

export const fetchPermissions = async () => {
  const res = await axios.get("http://localhost:5000/permissions");
  return res.data;
};
