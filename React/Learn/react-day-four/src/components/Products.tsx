import React from "react";
import Layout from "./Layout";
import { Link } from "react-router-dom";
const Products: React.FC = () => {
    const [products, setProducts] = React.useState(() => {
      const storedProducts = localStorage.getItem("products");
      return storedProducts ? JSON.parse(storedProducts) : [];
    });
  
    return (
      <Layout>
        <table className="w-full border-collapse border border-gray-400">
          <thead>
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product: any) => (
              <tr key={product.id}>
                <td className="border p-2">{product.id}</td>
                <td className="border p-2">{product.name}</td>
                <td className="border p-2">
                  <Link to={`/view-product/${product.id}`} className="mr-2">View</Link>
                  <Link to={`/edit-product/${product.id}`}>Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Layout>
    );
  };

export default Products;