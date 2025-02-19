import React from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Moon, Sun } from "react-feather";
import { useTheme } from "./ThemeContext"; // Import theme context

interface HeaderProps {
  title?: string;
  links?: { name: string; href: string }[];
}

const HeaderGlobal: React.FC<HeaderProps> = ({ 
  title = "Header", 
  links = [
    { name: "Home", href: "#" }, 
    { name: "About", href: "#" }, 
    { name: "Tasks", href: "#" }, 
    { name: "Contact", href: "#" }
  ] 
}) => {
  const { darkMode, toggleDarkMode } = useTheme(); // Access dark mode state

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
