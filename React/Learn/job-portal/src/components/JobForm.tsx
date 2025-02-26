import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { postJob } from "../api/jobsApi";
import { addJob } from "../redux/slices/jobsSlice";
import { Button, Input } from "antd";

const JobForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [salary, setSalary] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  const handleSubmit = async () => {
    if (!user) return alert("Please log in to post a job");

    const newJob = { title, description, salary, location, type, postedBy: user.username };
    const { data } = await postJob(newJob);
    dispatch(addJob(data));
  };

  return (
    <div>
      <Input placeholder="Title" onChange={(e) => setTitle(e.target.value)} />
      <Input placeholder="Description" onChange={(e) => setDescription(e.target.value)} />
      <Input placeholder="Salary" onChange={(e) => setSalary(e.target.value)} />
      <Input placeholder="Location" onChange={(e) => setLocation(e.target.value)} />
      <Input placeholder="Job Type (Full-time/Part-time)" onChange={(e) => setType(e.target.value)} />
      <Button onClick={handleSubmit} type="primary">Post Job</Button>
    </div>
  );
};

export default JobForm;
