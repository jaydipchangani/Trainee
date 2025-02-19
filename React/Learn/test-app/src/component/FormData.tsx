import React from 'react';
import { useState } from 'react';

type ObjectType ={
    task:string,
    description:string,
    completed:boolean
} 
const FormData: React.FC<ObjectType>=()=>{

    const[task,setTask]=useState<ObjectType>({task:"",description:"",completed:false})

    return(
        <div>  
            <input type="text" value={task.task} onChange={(e)=>setTask({...task,task:e.target.value})} placeholder="Task" />
            <input type="text" value={task.description} onChange={(e)=>setTask({...task,description:e.target.value})} placeholder="Description" />
            <button onClick={()=>console.log(task)}>Submit</button>
        </div>
    )

}


export default FormData;