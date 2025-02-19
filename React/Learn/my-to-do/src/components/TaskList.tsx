import React from "react";
import Task from "./Task";

interface TaskListProps {
  tasks: Task[];
  removeTask: (id: number) => void;
  completeTask: (id: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, removeTask, completeTask }) => {
  return (
    <div className="mt-3">
      {tasks.map((task) => (
        <Task key={task.id} text={task.text} day={task.day} id={task.id} removeTask={removeTask} completeTask={completeTask} />
      ))}
    </div>
  );
};

export default TaskList;