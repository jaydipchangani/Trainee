import React, { useMemo, useCallback } from "react";
import { Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const Products: React.FC = () => {
  const products = useMemo(() => JSON.parse(localStorage.getItem("products") || "[]"), []);

  const handleDelete = useCallback((id: number) => {
    const updatedProducts = products.filter((product: any) => product.id !== id);
    localStorage.setItem("products", JSON.stringify(updatedProducts));
    window.location.reload();
  }, [products]);

  return (
    <div className="text-center">
      <h2>Products List</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product: any) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.quantity}</td>
              <td>{product.price}</td>
              <td>
                <Link to={`/view-product/${product.id}`} className="btn btn-primary me-2">View</Link>
                <Link to={`/edit-product/${product.id}`} className="btn btn-warning me-2">Edit</Link>
                <Button variant="danger" onClick={() => handleDelete(product.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Products;
