import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

interface TaskProps {
  text: string;
  day: string;
  id: number;
}

const Task: React.FC<TaskProps> = ({ text, day, id }) => {
  return (
    <div className="card mb-3 shadow-sm p-3 bg-white rounded">
      <div className="card-body d-flex justify-content-between">
        <h5 className="card-title">{text}</h5>
        <p className="card-text">{day}</p>
        <div>
        <FontAwesomeIcon icon={faCheck}  size="2x" color="green"  />
       
        &nbsp;&nbsp;&nbsp;
        <FontAwesomeIcon icon={faCircleXmark} size="2x" color="red" onClick={() => console.log(`ID: ${id}, Task: ${text}, Task Completed`)} />
        </div>
        

      </div>
    </div>
  );
};

export default Task;