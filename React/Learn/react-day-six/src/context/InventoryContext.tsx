import React, { createContext, useReducer, useContext } from "react";
import { notification } from "antd";

interface Product {
  id: number;
  name: string;
  quantity: number;
  price: number;
  description: string;
  image: string;
}

interface State {
  inventory: Product[];
  cart: Product[];
}


type Action =            
  | { type: "ADD_PRODUCT"; payload: Product }
  | { type: "EDIT_PRODUCT"; payload: Product }
  | { type: "DELETE_PRODUCT"; payload: number }
  | { type: "ADD_TO_CART"; payload: number }
  | { type: "REMOVE_FROM_CART"; payload: number }
  | { type: "INCREASE_QUANTITY"; payload: number }
  | { type: "DECREASE_QUANTITY"; payload: number };

const initialState: State = {
  inventory: [],
  cart: [],
};

const showNotification = (type: "success" | "error" | "warning", message: string) => {
  notification.destroy();
  notification[type]({
    message,
    placement: "topRight",
  });
};

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


        updatedCart = state.cart.map((product) =>    
          product.id === action.payload.id ? { ...product, ...action.payload } : product
        );
        
      showNotification("success", "Product updated successfully!");
      return { ...state, inventory: updatedInventory, cart: updatedCart };

    case "DELETE_PRODUCT":
      updatedInventory = state.inventory.filter(
        (product) => product.id !== action.payload
      );
      updatedCart = state.cart.filter((product) => product.id !== action.payload);
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


const InventoryContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;   //state update krva, provide by useReduser
} | null>(null);

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <InventoryContext.Provider value={{ state, dispatch }}>
      {children}
    </InventoryContext.Provider>
  );
};


export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return context;
};
