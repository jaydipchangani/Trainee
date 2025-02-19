import React, { useState } from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Moon, Sun } from "react-feather";

//use this way
        {/* 
            <HeaderGlobal 
        title="Task Manager" 
        darkModeEnabled={true} 
        links={[
        { name: "Dashboard", href: "/dashboard" },
        { name: "Tasks", href: "/tasks" },
        { name: "Profile", href: "/profile" },
        { name: "Logout", href: "/logout" }
        ]}
        /> 
        
        */}
interface HeaderProps {
  title?: string; // Optional title
  links?: { name: string; href: string }[]; // Array of links
  darkModeEnabled?: boolean; // Optional dark mode setting
}

const HeaderGlobal: React.FC<HeaderProps> = ({ 
  title = "Header", 
  links = [
    { name: "Home", href: "#" }, 
    { name: "About", href: "#" }, 
    { name: "Tasks", href: "#" }, 
    { name: "Contact", href: "#" }
  ], 
  darkModeEnabled = false 
}) => {
  const [darkMode, setDarkMode] = useState(darkModeEnabled);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("bg-dark");
    document.body.classList.toggle("text-light");
  };

  return (
    <Navbar expand="lg" bg={darkMode ? "dark" : "light"} variant={darkMode ? "dark" : "light"} className="shadow">
      <Container>
        <Navbar.Brand href="#" className="fw-bold fs-4">📝 {title}</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {links.map((link, index) => (
              <Nav.Link key={index} href={link.href}>{link.name}</Nav.Link>
            ))}
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
