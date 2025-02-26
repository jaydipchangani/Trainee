import axios from "axios";
export const getJobs = async () => await axios.get("http://localhost:5000/jobs");
export const postJob = async (job: any) => await axios.post("http://localhost:5000/jobs", job);
