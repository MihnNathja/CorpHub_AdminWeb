import { Routes, Route } from "react-router-dom";
import LoginPage from "../features/auth/pages/LoginPage";
import UserList from "../features/user/pages/UserList";
import PrivateRoute from "./PrivateRoute";
import HomePage from "../pages/HomePage";
import Dashboard from "../pages/DashBoard";
import TicketsPage from "../features/ticket/pages/TicketPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route path="/" element={<Dashboard />}>
        <Route index element={<HomePage />} />
        <Route path="tickets" element={<TicketsPage />} />
        <Route path="users" element={<UserList />} />
        {/* <Route path="settings" element={<SettingsPage />} /> */}
      </Route>
    </Routes>
  );
};

export default AppRoutes;
