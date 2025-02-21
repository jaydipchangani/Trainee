
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import AddProduct from "./components/AddProducts";
import Products from "./components/products";
import ViewProduct from "./components/ViewProduct";
import EditProduct from "./components/EditComponent";

const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Products />} />
      <Route path="/products" element={<Products />} />
      <Route path="/add-product" element={<AddProduct />} />
      <Route path="/view-product/:id" element={<ViewProduct />} />
      <Route path="/edit-product/:id" element={<EditProduct />} />
    </Routes>
  </Router>
);

export default App;
