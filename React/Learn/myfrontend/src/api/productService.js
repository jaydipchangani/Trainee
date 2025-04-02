import axios from "axios";

const API_URL = "https://localhost:7193/api/Products"; // Update this with your .NET backend URL

// Get all products
export const getProducts = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
};

// Add a new product
export const addProduct = async (product) => {
    try {
        const response = await axios.post(API_URL, product);
        return response.data;
    } catch (error) {
        console.error("Error adding product:", error);
    }
};

// Update a product
export const updateProduct = async (id, updatedProduct) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, updatedProduct);
        return response.data;
    } catch (error) {
        console.error("Error updating product:", error);
    }
};

// Delete a product
export const deleteProduct = async (id) => {
    try {
        await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
        console.error("Error deleting product:", error);
    }
};
