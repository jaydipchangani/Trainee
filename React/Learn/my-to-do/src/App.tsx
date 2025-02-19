import { useState } from 'react';
import AddTask from './components/AddTask';
import TaskList from './components/TaskList';
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';

function App() {
  return (
    <div className="container mt-5 p-4 bg-light rounded shadow">
      <h1 className='text-primary text-center mb-4'>To-Do List</h1>
      <AddTask />
      <TaskList />
    </div>
  );
}

export default App;