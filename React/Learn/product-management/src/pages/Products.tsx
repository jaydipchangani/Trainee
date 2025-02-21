import React, { useMemo } from "react";
import { Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const Products: React.FC = () => {
  const products = useMemo(() => JSON.parse(localStorage.getItem("products") || "[]"), []);

  return (
    <div className="text-center">
      <h2>Products List</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product: any) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>
                <Link to={`/view-product/${product.id}`} className="btn btn-primary me-2">View</Link>
                <Link to={`/edit-product/${product.id}`} className="btn btn-warning">Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Products;