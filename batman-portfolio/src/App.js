import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import AboutMe from './components/AboutMe';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Education from './components/Education';
import Contact from './components/contact';
import Navigation from './components/Navigation';
import './styles.css';

function App() {
  return (
    <div className="App">
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls />
        <AboutMe />
        <Skills />
        <Projects />
        <Experience />
        <Education />
        <Contact />
      </Canvas>
      <Navigation />
    </div>
  );
}

export default App;