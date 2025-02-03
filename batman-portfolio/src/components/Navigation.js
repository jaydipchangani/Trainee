// src/components/Navigation.js
import React from 'react';

function Navigation() {
  const scrollToSection = (position) => {
    window.scrollTo({
      top: position,
      behavior: 'smooth',
    });
  };

  return (
    <nav>
      <button onClick={() => scrollToSection(0)}>About Me</button>
      <button onClick={() => scrollToSection(500)}>Skills</button>
      <button onClick={() => scrollToSection(1000)}>Projects</button>
      <button onClick={() => scrollToSection(1500)}>Experience</button>
      <button onClick={() => scrollToSection(2000)}>Education</button>
      <button onClick={() => scrollToSection(2500)}>Contact</button>
    </nav>
  );
}

export default Navigation;