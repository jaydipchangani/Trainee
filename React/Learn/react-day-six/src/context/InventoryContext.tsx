import React, { createContext, useReducer, useContext, useEffect } from "react";

// Product Type
interface Product {
  id: number;
  name: string;
  quantity: number;
  description: string;
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

// Reducer Function
const reducer = (state: State, action: Action): State => {
  let updatedCart;
  switch (action.type) {
    case "ADD_PRODUCT":
      const newInventory = [...state.inventory, action.payload];
      localStorage.setItem("inventory", JSON.stringify(newInventory));
      return { ...state, inventory: newInventory };

    case "EDIT_PRODUCT":
      const editedInventory = state.inventory.map((product) =>
        product.id === action.payload.id ? action.payload : product
      );
      localStorage.setItem("inventory", JSON.stringify(editedInventory));
      return { ...state, inventory: editedInventory };

    case "DELETE_PRODUCT":
      const filteredInventory = state.inventory.filter(
        (product) => product.id !== action.payload
      );
      localStorage.setItem("inventory", JSON.stringify(filteredInventory));
      return { ...state, inventory: filteredInventory };

    case "ADD_TO_CART":
      const product = state.inventory.find((p) => p.id === action.payload);
      if (product) {
        updatedCart = [...state.cart, { ...product, quantity: 1 }];
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        return { ...state, cart: updatedCart };
      }
      return state;

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
    localStorage.setItem("inventory", JSON.stringify(state.inventory));
    localStorage.setItem("cart", JSON.stringify(state.cart));
  }, [state]);

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
