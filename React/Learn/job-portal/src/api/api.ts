import axios from "axios";

const API_URL = "http://localhost:5000";

export const registerUser = (user: any) => axios.post(`${API_URL}/users`, user);

export const loginUser = async (email: string) => {
  const { data } = await axios.get(`${API_URL}/users?email=${email}`);
  return data[0];
};

export const fetchJobs = () => axios.get(`${API_URL}/jobs`);

export const postJob = (job: any) => axios.post(`${API_URL}/jobs`, job);
