import React, { useState } from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Moon, Sun } from "react-feather";

const HeaderGlobal: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("bg-dark");
    document.body.classList.toggle("text-light");
  };

  return (
    <Navbar expand="lg" bg={darkMode ? "dark" : "light"} variant={darkMode ? "dark" : "light"} className="shadow">
      <Container>
        <Navbar.Brand href="#" className="fw-bold fs-4">📝 To-Do App</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="#">Home</Nav.Link>
            <Nav.Link href="#">About</Nav.Link>
            <Nav.Link href="#">Tasks</Nav.Link>
            <Nav.Link href="#">Contact</Nav.Link>
          </Nav>
          <Button variant={darkMode ? "light" : "dark"} className="ms-3" onClick={toggleDarkMode}>
            {darkMode ? <Sun /> : <Moon />}
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default HeaderGlobal;
