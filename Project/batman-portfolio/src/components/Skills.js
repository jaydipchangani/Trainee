// src/components/Skills.js
import React from 'react';

function Skills() {
  return (
    <group position={[0, 0, -5]}>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="blue" />
      </mesh>
      <mesh position={[2, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 1, 32]} />
        <meshStandardMaterial color="green" />
      </mesh>
      <mesh position={[-2, 0, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="red" />
      </mesh>
    </group>
  );
}

export default Skills;