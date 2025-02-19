import { useState } from 'react';
import AddTask from './components/AddTask';
import TaskList from './components/TaskList';
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';

interface Task {
  id: number;
  text: string;
  description: string;
  completed: boolean;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = (text: string, description: string) => {
    const newTask: Task = {
      id: tasks.length + 1,
      text,
      description,
      completed: false,
    };
    setTasks([...tasks, newTask]);
  };

  const removeTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const completeTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
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
