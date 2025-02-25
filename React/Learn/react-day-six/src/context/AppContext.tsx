import React, { createContext, useReducer, ReactNode } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface State {
  inventory: Product[];
  cart: Product[];
}

type Action =
  | { type: "ADD_PRODUCT"; product: Product }
  | { type: "EDIT_PRODUCT"; product: Product }
  | { type: "DELETE_PRODUCT"; id: number }
  | { type: "ADD_TO_CART"; id: number }
  | { type: "INCREMENT_CART"; id: number }
  | { type: "DECREMENT_CART"; id: number }
  | { type: "REMOVE_FROM_CART"; id: number };

const initialState: State = {
  inventory: [],
  cart: [],
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_PRODUCT":
      return { ...state, inventory: [...state.inventory, action.product] };

    case "EDIT_PRODUCT":
      return {
        ...state,
        inventory: state.inventory.map((p) =>
          p.id === action.product.id ? action.product : p
        ),
      };

    case "DELETE_PRODUCT":
      return {
        ...state,
        inventory: state.inventory.filter((p) => p.id !== action.id),
      };

    case "ADD_TO_CART":
      const product = state.inventory.find((p) => p.id === action.id);
      if (!product) return state;
      return {
        ...state,
        cart: [...state.cart, { ...product, quantity: 1 }],
      };

    case "INCREMENT_CART":
      return {
        ...state,
        cart: state.cart.map((p) =>
          p.id === action.id ? { ...p, quantity: p.quantity + 1 } : p
        ),
      };

    case "DECREMENT_CART":
      return {
        ...state,
        cart: state.cart
          .map((p) =>
            p.id === action.id && p.quantity > 1
              ? { ...p, quantity: p.quantity - 1 }
              : p
          )
          .filter((p) => p.quantity > 0),
      };

    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter((p) => p.id !== action.id),
      };

    default:
      return state;
  }
};

export const AppContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => {} });

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
