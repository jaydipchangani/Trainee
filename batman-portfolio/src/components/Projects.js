// src/components/Projects.js
import React from 'react';

function Projects() {
  return (
    <group position={[0, 0, -10]}>
      <mesh>
        <planeGeometry args={[3, 2]} />
        <meshStandardMaterial color="gray" />
      </mesh>
      <mesh position={[4, 0, 0]}>
        <boxGeometry args={[2, 3, 0.1]} />
        <meshStandardMaterial color="black" />
      </mesh>
    </group>
  );
}

export default Projects;