import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getUserFromLocalStorage, saveUserToLocalStorage, removeUserFromLocalStorage } from "../../utils/localStorage";

interface User {
  id: number;
  username: string;
}

interface AuthState {
  user: User | null;
}

const initialState: AuthState = {
  user: getUserFromLocalStorage()
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      saveUserToLocalStorage(action.payload);
    },
    logout: (state) => {
      state.user = null;
      removeUserFromLocalStorage();
    }
  }
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
