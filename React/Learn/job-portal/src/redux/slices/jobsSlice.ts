import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface Job {
  id: number;
  title: string;
  description: string;
  salary: string;
  location: string;
  type: string;
  postedBy: string;
}

interface JobsState {
  jobs: Job[];
}

const initialState: JobsState = {
  jobs: []
};

export const fetchJobs = createAsyncThunk("jobs/fetchJobs", async () => {
  const response = await axios.get("http://localhost:5000/jobs");
  return response.data;
});

const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    addJob: (state, action: PayloadAction<Job>) => {
      state.jobs.push(action.payload);
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchJobs.fulfilled, (state, action) => {
      state.jobs = action.payload;
    });
  }
});

export const { addJob } = jobsSlice.actions;
export default jobsSlice.reducer;
