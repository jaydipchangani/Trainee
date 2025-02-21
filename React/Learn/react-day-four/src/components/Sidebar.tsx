import React from "react";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

const Sidebar: React.FC = () => (
  <aside className="bg-dark text-white p-4 vh-100 position-fixed">
    <nav>
      <ul className="nav flex-column">
        <li className="nav-item mb-3">
          <Link to="/products" className="nav-link text-white">Products</Link>
        </li>
        <li className="nav-item mb-3">
          <Link to="/add-product" className="nav-link text-white">Add Product</Link>
        </li>
      </ul>
    </nav>
  </aside>
);

export default Sidebar;
