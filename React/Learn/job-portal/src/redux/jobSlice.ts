import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/jobs";

export const fetchJobs = createAsyncThunk("jobs/fetchJobs", async () => {
  const response = await axios.get(API_URL);
  return response.data;
});

export const addJob = createAsyncThunk("jobs/addJob", async (jobData) => {
  const response = await axios.post(API_URL, jobData);
  return response.data;
});

const jobSlice = createSlice({
  name: "jobs", 
  initialState: { jobs: [], status: "idle" },
  reducers: {},
  extraReducers: (builder) => {  
    builder
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.jobs = action.payload;
      })
      .addCase(addJob.fulfilled, (state, action) => {
        state.jobs.push(action.payload);
      });
  }
});

export default jobSlice.reducer;
