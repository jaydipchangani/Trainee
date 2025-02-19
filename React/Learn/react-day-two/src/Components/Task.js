import React from "react";

function Task({text,day,id}) {
  return (
    <>
        <h3>{text}</h3>
        <p>{day}</p>
        <button onClick={()=>console.log({id},{text},"Task Completed")}>Completed</button>
    </>
  );
}

export default Task;