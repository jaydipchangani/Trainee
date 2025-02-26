import { Card } from "antd";

interface JobProps {
  job: {
    id: number;
    title: string;
    description: string;
    salary: string;
    location: string;
    type: string;
    postedBy: string;
  };
}

const JobCard = ({ job }: JobProps) => {
  return (
    <Card title={job.title} style={{ marginBottom: "20px" }}>
      <p><strong>Description:</strong> {job.description}</p>
      <p><strong>Salary:</strong> {job.salary}</p>
      <p><strong>Location:</strong> {job.location}</p>
      <p><strong>Type:</strong> {job.type}</p>
      <p><strong>Posted By:</strong> {job.postedBy}</p>
    </Card>
  );
};

export default JobCard;
