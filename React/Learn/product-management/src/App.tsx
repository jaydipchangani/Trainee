import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import MainLayout from "./layout/MainLayout";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import ViewProduct from "./pages/ViewProduct";
import EditProduct from "./pages/EditProduct";
import "bootstrap/dist/css/bootstrap.min.css";
import NotFound from "./pages/NotFound";

const App: React.FC = () => {
  return (
    <Router>
      <MainLayout>
        <Container className="mt-4">
          <Routes>
            <Route path="/" element={<h1>Home Page</h1>} />
            <Route path="/products" element={<Products />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/view-product/:id" element={<ViewProduct />} />
            <Route path="/edit-product/:id" element={<EditProduct />} />
            <Route path="*" element={<NotFound/>}/>
          </Routes>
        </Container>
      </MainLayout>
    </Router>
  );
};

export default App;