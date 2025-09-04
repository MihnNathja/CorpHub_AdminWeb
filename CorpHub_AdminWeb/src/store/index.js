import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/store/authSlice";
import userReducer from "../features/user/store/userSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
  },
});
