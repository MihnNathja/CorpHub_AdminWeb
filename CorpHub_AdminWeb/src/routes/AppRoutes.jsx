import { Routes, Route } from "react-router-dom";
import LoginPage from "../features/auth/pages/LoginPage";
import HomePage from "../pages/HomePage";
import Dashboard from "../pages/Dashboard";
import TicketsPage from "../features/ticket/pages/TicketPage";
import UserList from "../features/user/pages/UserList";
import PrivateRoute from "../routes/PrivateRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Private routes */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      >
        <Route index element={<HomePage />} />
        <Route path="tickets" element={<TicketsPage />} />
        <Route path="users" element={<UserList />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
