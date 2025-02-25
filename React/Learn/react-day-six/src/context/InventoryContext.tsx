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

// Initial State
const initialState: State = {
  inventory: [],
  cart: [],
};

// Notification Helper
const showNotification = (type: "success" | "error" | "warning", message: string) => {
  notification.destroy(); // Clear any existing notifications
  notification[type]({
    message,
    placement: "topRight",
  });
};

// Reducer Function
const reducer = (state: State, action: Action): State => {
  let updatedInventory, updatedCart;
  switch (action.type) {
    case "ADD_PRODUCT":
      updatedInventory = [...state.inventory, action.payload];
      showNotification("success", "Product added successfully!");
      return { ...state, inventory: updatedInventory };

    case "EDIT_PRODUCT":
      updatedInventory = state.inventory.map((product) =>
        product.id === action.payload.id ? action.payload : product
      );
      showNotification("success", "Product updated successfully!");
      return { ...state, inventory: updatedInventory };

    case "DELETE_PRODUCT":
      updatedInventory = state.inventory.filter(
        (product) => product.id !== action.payload
      );
      updatedCart = state.cart.filter((product) => product.id !== action.payload); // 🔥 Remove from cart too
      showNotification("error", "Product deleted successfully!");
      return { ...state, inventory: updatedInventory, cart: updatedCart };

    case "ADD_TO_CART":
      const product = state.inventory.find((p) => p.id === action.payload);
      if (!product) {
        showNotification("error", "Product is no longer available!");
        return state;
      }

      if (state.cart.some((p) => p.id === action.payload)) {
        showNotification("warning", "Product is already in the cart!");
        return state;
      }

      updatedCart = [...state.cart, { ...product, quantity: 1 }];
      showNotification("success", "Product added to cart!");
      return { ...state, cart: updatedCart };

    case "REMOVE_FROM_CART":
      updatedCart = state.cart.filter((p) => p.id !== action.payload);
      return { ...state, cart: updatedCart };

    case "INCREASE_QUANTITY":
      updatedCart = state.cart.map((p) =>
        p.id === action.payload ? { ...p, quantity: p.quantity + 1 } : p
      );
      return { ...state, cart: updatedCart };

    case "DECREASE_QUANTITY":
      updatedCart = state.cart
        .map((p) =>
          p.id === action.payload && p.quantity > 1
            ? { ...p, quantity: p.quantity - 1 }
            : p
        )
        .filter((p) => p.quantity > 0);
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
  const [state, dispatch] = useReducer(reducer, initialState);

  // Ensure cart only contains items still in inventory
  useEffect(() => {
    const filteredCart = state.cart.filter((cartItem) =>
      state.inventory.some((invItem) => invItem.id === cartItem.id)
    );

    if (JSON.stringify(state.cart) !== JSON.stringify(filteredCart)) {
      dispatch({ type: "REMOVE_FROM_CART", payload: -1 }); // Dummy action to trigger re-render
    }
  }, [state.inventory, state.cart]);

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
