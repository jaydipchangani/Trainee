// src/components/Education.js
import React from 'react';

function Education() {
  return (
    <group position={[0, 0, -20]}>
      <mesh>
        <coneGeometry args={[1, 2, 32]} />
        <meshStandardMaterial color="yellow" />
      </mesh>
    </group>
  );
}

export default Education;