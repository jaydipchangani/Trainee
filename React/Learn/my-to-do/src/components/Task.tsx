import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faCheck } from '@fortawesome/free-solid-svg-icons';

interface TaskProps {
  text: string;
  day: string;
  id: number;
  removeTask: (id: number) => void;
  completeTask: (id: number) => void;
}

const Task: React.FC<TaskProps> = ({ text, day, id, removeTask, completeTask }) => {
  return (
    <div className="card mb-3 shadow-sm p-3 bg-white rounded">
      <div className="card-body d-flex justify-content-between align-items-center">
        <div>
          <h5 className="card-title">{text}</h5>
          <p className="card-text text-muted">{day}</p>
        </div>
        <div>
          <FontAwesomeIcon icon={faCheck} size="2x" color="green" onClick={() => completeTask(id)} className="me-3 cursor-pointer" />
          <FontAwesomeIcon icon={faCircleXmark} size="2x" color="red" onClick={() => removeTask(id)} className="cursor-pointer" />
        </div>
      </div>
    </div>
  );
};
export default Task;