// src/components/Experience.js
import React from 'react';

function Experience() {
  return (
    <group position={[0, 0, -15]}>
      <mesh>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="purple" />
      </mesh>
    </group>
  );
}

export default Experience;