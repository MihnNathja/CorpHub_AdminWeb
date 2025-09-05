import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/store/authSlice";
import userReducer from "../features/user/store/userSlice";
import ticketReducer from "../features/ticket/store/ticketSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    tickets: ticketReducer
  },
});
