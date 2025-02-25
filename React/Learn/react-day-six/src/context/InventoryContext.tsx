import React, { createContext, useReducer, useContext, useEffect } from "react";
import { notification } from "antd";

// Product Type
interface Product {
  id: number;
  name: string;
  quantity: number;
  description: string;
  image: string;
}

// State Type
interface State {
  inventory: Product[];
  cart: Product[];
}

// Action Types
type Action =
  | { type: "ADD_PRODUCT"; payload: Product }
  | { type: "EDIT_PRODUCT"; payload: Product }
  | { type: "DELETE_PRODUCT"; payload: number }
  | { type: "ADD_TO_CART"; payload: number }
  | { type: "REMOVE_FROM_CART"; payload: number }
  | { type: "INCREASE_QUANTITY"; payload: number }
  | { type: "DECREASE_QUANTITY"; payload: number };

// Initial State from LocalStorage
const getInitialState = (): State => ({
  inventory: JSON.parse(localStorage.getItem("inventory") || "[]"),
  cart: JSON.parse(localStorage.getItem("cart") || "[]"),
});

// Notification Helper (Ensures notifications show only once)
const showNotification = (type: "success" | "error", message: string) => {
  notification.destroy(); // Clear any existing notifications
  notification[type]({
    message,
    placement: "topRight",
  });
};

// Reducer Function (Handles state changes and storage)
const reducer = (state: State, action: Action): State => {
  let updatedInventory, updatedCart;
  switch (action.type) {
    case "ADD_PRODUCT":
      updatedInventory = [...state.inventory, action.payload];
      localStorage.setItem("inventory", JSON.stringify(updatedInventory));
      showNotification("success", "Product added successfully!");
      return { ...state, inventory: updatedInventory };

    case "EDIT_PRODUCT":
      updatedInventory = state.inventory.map((product) =>
        product.id === action.payload.id ? action.payload : product
      );
      localStorage.setItem("inventory", JSON.stringify(updatedInventory));
      showNotification("success", "Product updated successfully!");
      return { ...state, inventory: updatedInventory };

    case "DELETE_PRODUCT":
      updatedInventory = state.inventory.filter(
        (product) => product.id !== action.payload
      );
      updatedCart = state.cart.filter((product) => product.id !== action.payload); // 🔥 Remove from cart too

      localStorage.setItem("inventory", JSON.stringify(updatedInventory));
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      showNotification("error", "Product deleted successfully!");
      return { ...state, inventory: updatedInventory, cart: updatedCart };

    case "ADD_TO_CART":
      // 🔥 Check if the product exists in inventory
      const product = state.inventory.find((p) => p.id === action.payload);
      if (!product) {
        showNotification("error", "Product is no longer available!");
        return state;
      }

      // 🔥 Check if the product is already in the cart
      if (state.cart.some((p) => p.id === action.payload)) {
        showNotification("warning", "Product is already in the cart!");
        return state;
      }

      updatedCart = [...state.cart, { ...product, quantity: 1 }];
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      showNotification("success", "Product added to cart!");
      return { ...state, cart: updatedCart };

    case "REMOVE_FROM_CART":
      updatedCart = state.cart.filter((p) => p.id !== action.payload);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return { ...state, cart: updatedCart };

    case "INCREASE_QUANTITY":
      updatedCart = state.cart.map((p) =>
        p.id === action.payload ? { ...p, quantity: p.quantity + 1 } : p
      );
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return { ...state, cart: updatedCart };

    case "DECREASE_QUANTITY":
      updatedCart = state.cart
        .map((p) =>
          p.id === action.payload && p.quantity > 1
            ? { ...p, quantity: p.quantity - 1 }
            : p
        )
        .filter((p) => p.quantity > 0);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return { ...state, cart: updatedCart };

    default:
      return state;
  }
};

// Create Context
const InventoryContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
} | null>(null);

// Provider Component
export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, {}, getInitialState);

  useEffect(() => {
    // 🔥 Ensure only available inventory products remain in cart
    const filteredCart = state.cart.filter((cartItem) =>
      state.inventory.some((invItem) => invItem.id === cartItem.id)
    );

    if (JSON.stringify(state.cart) !== JSON.stringify(filteredCart)) {
      localStorage.setItem("cart", JSON.stringify(filteredCart));
    }

    localStorage.setItem("inventory", JSON.stringify(state.inventory));
  }, [state.inventory, state.cart]); // ✅ Triggers only when inventory/cart changes

  return (
    <InventoryContext.Provider value={{ state, dispatch }}>
      {children}
    </InventoryContext.Provider>
  );
};

// Custom Hook to Use Inventory Context
export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return context;
};
