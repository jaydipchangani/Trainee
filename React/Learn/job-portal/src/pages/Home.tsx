import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobs } from "../redux/slices/jobsSlice";
import { RootState } from "../redux/store";
import JobList from "../components/JobList";

const Home = () => {
  const dispatch = useDispatch();
  const jobs = useSelector((state: RootState) => state.jobs.jobs);

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  return (
    <div>
      <h2>Job Listings</h2>
      <JobList jobs={jobs} />
    </div>
  );
};

export default Home;
