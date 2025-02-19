import { useState } from 'react';
import AddTask from './components/AddTask';
import TaskList from './components/TaskList';
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';

interface Task {
  id: number;
  text: string;
  day: string;
  reminder: boolean;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: 'Doctors Appointment', day: 'Annual health check-up with Dr. Smith at City Hospital.', reminder: true },
    { id: 2, text: 'Meeting at School', day: 'Parent-teacher meeting at Green Valley High School to discuss student progress.', reminder: true },
    { id: 3, text: 'Food Shopping', day: 'Buy groceries including vegetables, fruits, and dairy from the local supermarket.', reminder: false }
  ]);

  const addTask = (taskText: string, taskDesc: string) => {
    const newTask: Task = {
      id: tasks.length + 1,
      text: taskText,
      day: taskDesc,
      reminder: false
    };
    setTasks([...tasks, newTask]);
  };

  const removeTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const completeTask = (id: number) => {
    console.log(`Task with ID ${id} completed`);
  };

  return (
    <div className="container mt-5 p-4 bg-light rounded shadow">
      <h1 className='text-primary text-center mb-4'>To-Do List</h1>
      <AddTask addTask={addTask} />
      <TaskList tasks={tasks} removeTask={removeTask} completeTask={completeTask} />
    </div>
  );
}

export default App;