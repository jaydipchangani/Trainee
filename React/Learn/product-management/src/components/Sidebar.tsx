import React from "react";
import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

const Sidebar: React.FC = () => {
  return (
    <Nav className="flex-column bg-light p-3" style={{ height: "100vh" }}>
      <Nav.Link as={Link} to="/products">Products</Nav.Link>
      <Nav.Link as={Link} to="/add-product">Add Product</Nav.Link>
    </Nav>
  );
};

export default Sidebar;