import JobCard from "./JobCard";

const JobList = ({ jobs }: { jobs: any[] }) => {
  return (
    <div>
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
};

export default JobList;
