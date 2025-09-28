import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/store/authSlice";
import userReducer from "../features/user/store/userSlice";
import departmentReducer from "../features/department/store/departmentSlice";
import ticketReducer from "../features/ticket/store/ticketSlice";
import categoryReducer from "../features/ticket/store/categorySlice";
import eventReducer from "../features/calendar/store/calendarSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    department: departmentReducer,
    tickets: ticketReducer,
    category: categoryReducer,
    events: eventReducer,
  },
});
