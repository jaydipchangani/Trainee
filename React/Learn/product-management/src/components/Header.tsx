import React from "react";
import { Navbar } from "react-bootstrap";

const Header: React.FC = () => {
  return (
    <Navbar bg="dark" variant="dark" className="px-3">
      <Navbar.Brand href="/products">Product Management</Navbar.Brand>
    </Navbar>
  );
};

export default Header;