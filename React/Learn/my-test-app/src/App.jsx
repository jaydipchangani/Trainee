import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Dashboard from './Pages/dashboard'
import About from './Pages/about'
import Notfound from './Pages/notfound'
import Settings from './Pages/settings';
import Data from './Pages/data';
import { useEffect } from 'react';


function App() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.hs-scripts.com/342768122.js";
    script.async = true;
    script.defer = true;
    script.id = "hs-script-loader";
    document.body.appendChild(script);
  }, []);


  return (
    <>
    <Router>
  <Routes>
    <Route path="/dashboard" element={<Dashboard />}>
      <Route path="settings" element={<Settings />} />
    </Route>
    <Route path="/about-us/:name" element={<About />} />
    <Route path="*" element={<Notfound />} />
    <Route path="/data" element={<Data/>} />
  </Routes>
</Router>
    </>
  )
}

export default App
