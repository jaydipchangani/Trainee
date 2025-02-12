// src/components/Contact.js
import React from 'react';

function Contact() {
  return (
    <group position={[0, 0, -25]}>
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="orange" />
      </mesh>
    </group>
  );
}

export default Contact;