import React from 'react';
import { useState } from 'react';

function AddTask() {

        const[task,setTask]=useState('');

        const[des,setDes]=useState('');
 
  return (
    <>
        <input type='text' placeholder='Add Task' onChange={(e)=>{setTask(e.target.value)}}/>
        <input type='text' placeholder='Add Task Description' onChange={(e)=>{setDes(e.target.value)}} />
{task}{des}

        <button>Add</button>
    </>
  );
}

export default AddTask;