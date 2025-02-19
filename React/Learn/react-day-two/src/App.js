
import './App.css';
import AddTask from './Components/AddTask';
import 'bootstrap/dist/css/bootstrap.min.css';
import TaskList from './Components/TaskList';
import Task from './Components/Task';
import { useState } from'react';

const tasks = [
  { id: 1, text: 'Doctors Appointment', day: 'Feb 5th at 2:30pm', reminder: true },
  { id: 2, text: 'Meeting at School', day: 'Feb 6th at 1:30pm', reminder: true },
  { id: 3, text: 'Food Shopping', day: 'Feb 5th at 2:30pm', reminder: false },
  { id: 4, text: 'Doctors Appointment', day: 'Feb 5th at 2:30pm', reminder: true },
  { id: 5, text: 'Meeting at School', day: 'Feb 6th at 1:30pm', reminder: true },
  { id: 6, text: 'Food Shopping', day: 'Feb 5th at 2:30pm', reminder: false }
]


function App() {

  const[task,setTask]=useState('');
  
  const[des,setDes]=useState('');

  function AddTask(){
    const newTask = {
      id:Math.floor(Math.random()*1000),
      text:task,
      day:Date.now().toString(),
      reminder:true


    }
    
  }

return(
  <>
  <form>

      <input type='text' placeholder='Add Task' onChange={(e)=>{setTask(e.target.value)}}/>
      <input type='text' placeholder='Add Task Description' onChange={(e)=>{setDes(e.target.value)}} />
      <button>Add</button>
    {task}{des}
  </form>
      

    
      {tasks.map((task)=> {

          return(
            <>
            <div>
               <Task key={task.id} text={task.text} day={task.day} id={task.id}/>
            </div>
            </>
         
          )

      }) }




</>
    )

}

export default App;
