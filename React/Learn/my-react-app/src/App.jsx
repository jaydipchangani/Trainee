import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const username = "Jaydip";
  const isHero = false;

  return (
    <div>
      <h1>Hello, {username}!</h1>
      <p>{isHero ? "Welcome to Gotham City!" : "Welcome to React!"}</p>
      <button className="btn">Click Me</button>
    </div>
  );
}

export default App
