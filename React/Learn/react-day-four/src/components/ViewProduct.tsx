import type React from "react"
import { NavLink } from "react-router-dom"

const Sidebar: React.FC = () => {
  return (
    <nav className="bg-dark text-white p-3" style={{ width: "250px" }}>
      <ul className="nav flex-column">
        <li className="nav-item">
          <NavLink to="/products" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            Products
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/add-product" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            Add Product
          </NavLink>
        </li>
      </ul>
    </nav>
  )
}

export default Sidebar

