import React, { useState } from "react";

interface AddTaskProps {
  addTask: (text: string, description: string) => void;
}

const AddTask: React.FC<AddTaskProps> = ({ addTask }) => {
  const [taskText, setTaskText] = useState("");
  const [taskDescription, setTaskDescription] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    addTask(taskText, taskDescription);
    setTaskText("");
    setTaskDescription("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 p-4 bg-white shadow rounded">
      <div className="mb-3">
        <input 
          className="form-control" 
          value={taskText} 
          type="text" 
          required 
          placeholder="Enter Task" 
          onChange={(e) => setTaskText(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <input 
          className="form-control" 
          value={taskDescription} 
          type="text" 
          required 
          placeholder="Enter Task Description" 
          onChange={(e) => setTaskDescription(e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-primary w-100">Add Task</button>
    </form>
  );
};

export default AddTask;
