import axios from "axios";

const API_URL = "http://localhost:5000/projects";

export const fetchProjects = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const addProject = async (projectData: any) => {
  const response = await axios.post(API_URL, projectData);
  return response.data;
};

export const updateProject = async (id: number, updatedProject: any) => {
  const response = await axios.put(`${API_URL}/${id}`, updatedProject);
  return response.data;
};

export const deleteProject = async (id: number) => {
  await axios.delete(`${API_URL}/${id}`);
};
