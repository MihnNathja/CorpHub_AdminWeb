import { Routes, Route } from "react-router-dom";
import LoginPage from "../features/auth/pages/LoginPage";
import UserList from "../features/user/pages/UserList";
import PrivateRoute from "./PrivateRoute";
import HomePage from "../pages/HomePage";
import Dashboard from "../pages/DashBoard";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      
      <Route path="/login" element={<LoginPage />} />

      <Route path="/dashboard" element={<Dashboard />}>
        <Route index element={<HomePage />} />
        {/* <Route path="tickets" element={<TicketsPage />} /> */}
        <Route path="users" element={<UserList />} />
        {/* <Route path="settings" element={<SettingsPage />} /> */}
      </Route>
    </Routes>
  );
};

export default AppRoutes;
