import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";

const NotFound: React.FC = () => (
  <div className="d-flex flex-column justify-content-center align-items-center vh-100">
    <h1 className="display-1 text-danger">404</h1>
    <h2 className="text-secondary">Page Not Found</h2>
    <p className="text-muted">The page you are looking for does not exist.</p>
    <Link to="/products"><a href="" className="btn btn-primary mt-3">Go to Home</a></Link>
    
  </div>
);

export default NotFound;