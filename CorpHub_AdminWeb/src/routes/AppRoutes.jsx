import { Routes, Route } from "react-router-dom";
import LoginPage from "../features/auth/pages/LoginPage";
import HomePage from "../pages/HomePage";
import Dashboard from "../pages/Dashboard";
import TicketsPage from "../features/ticket/pages/TicketPage";
import CalendarPage from "../features/calendar/pages/CalendarPage";
import PrivateRoute from "../routes/PrivateRoute";
import UnauthorizedPage from "../pages/UnauthorizedPage";
import EmployeeTicketPage from "../features/ticket/pages/EmployeeTicketsPage";
import RoomPage from "../features/room/pages/RoomPage";
import FeatureComingSoonPage from "../pages/FeatureComingSoonPage";
import EmployeePage from "../features/employee/pages/EmployeePage";
import UserPage from "../features/user/pages/UserPage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/coming-soon" element={<FeatureComingSoonPage />} />

      {/* ✅ Private routes — chỉ 1 lớp PrivateRoute */}
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Dashboard />}>
          <Route index element={<HomePage />} />
          <Route path="rooms" element={<RoomPage />} />
          <Route path="users" element={<UserPage />} />
          <Route path="departments" element={<FeatureComingSoonPage />} />
          <Route path="tickets" element={<TicketsPage />} />
          <Route path="employees" element={<EmployeePage />} />
          <Route path="my-tickets" element={<EmployeeTicketPage />} />
          <Route path="projects" element={<FeatureComingSoonPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="settings" element={<FeatureComingSoonPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;