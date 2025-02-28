import axios from "axios";

const API_URL = "http://localhost:5000/employees";

export const fetchEmployees = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const addEmployee = async (employeeData: any) => {
  const response = await axios.post(API_URL, employeeData);
  return response.data;
};

export const updateEmployee = async (id: number, updatedEmployee: any) => {
  const response = await axios.put(`${API_URL}/${id}`, updatedEmployee);
  return response.data;
};

export const deleteEmployee = async (id: number) => {
  await axios.delete(`${API_URL}/${id}`);
};
