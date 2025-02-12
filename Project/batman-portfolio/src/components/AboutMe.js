// src/components/AboutMe.js
import React from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

function AboutMe() {
  const model = useLoader(GLTFLoader, '/assets/your-model.glb');
  return (
    <group>
      <primitive object={model.scene} position={[0, 0, 0]} />
      <mesh position={[0, -1, 0]}>
        <textGeometry args={['About Me', { size: 1, height: 0.2 }]} />
        <meshStandardMaterial color="white" />
      </mesh>
    </group>
  );
}

export default AboutMe;