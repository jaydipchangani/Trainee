import React from "react";
import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';


const Sidebar: React.FC = () => {
  return (
    <Nav className="flex-column bg-primary text-white p-3" style={{ height: "100vh", width: "200px" }}>
      <Nav.Link as={Link} to="/products" className="text-white mb-2" active>
        Products
      </Nav.Link>
      <Nav.Link as={Link} to="/add-product" className="text-white mb-2" active>
        Add Product
      </Nav.Link>
    </Nav>
  );
};

export default Sidebar;