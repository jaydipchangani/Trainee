import React from "react";
import Task from "./Task";

interface TaskListProps {
  tasks: { id: number; text: string; description: string; completed: boolean }[];
  removeTask: (id: number) => void;
  completeTask: (id: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, removeTask, completeTask }) => {
  return (
    <div className="mt-3">
      {tasks.map(task => (
        <Task 
          key={task.id} 
          text={task.text} 
          description={task.description} 
          id={task.id} 
          completed={task.completed}
          removeTask={removeTask} 
          completeTask={completeTask} 
        />
      ))}
    </div>
  );
};

export default TaskList;
