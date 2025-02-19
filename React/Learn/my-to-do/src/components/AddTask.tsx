import React, { useState } from "react";

interface AddTaskProps {
  addTask: (taskText: string, taskDesc: string) => void;
}

const AddTask: React.FC<AddTaskProps> = ({ addTask }) => {
  const [inputtask, setInputTask] = useState("");
  const [inputdes, setInputDes] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addTask(inputtask, inputdes);
    setInputTask("");
    setInputDes("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 p-4 bg-white shadow rounded">
      <div className="mb-3">
        <input 
          className="form-control" 
          value={inputtask} 
          type="text" 
          required 
          placeholder="Enter Task" 
          onChange={(e) => setInputTask(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <input 
          className="form-control" 
          value={inputdes} 
          type="text" 
          required 
          placeholder="Enter Task Description" 
          onChange={(e) => setInputDes(e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-primary w-100">Add Task</button>
    </form>
  );
};

export default AddTask;
