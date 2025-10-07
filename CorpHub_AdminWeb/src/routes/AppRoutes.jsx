import { Routes, Route } from "react-router-dom";
import LoginPage from "../features/auth/pages/LoginPage";
import HomePage from "../pages/HomePage";
import Dashboard from "../pages/Dashboard";
import TicketsPage from "../features/ticket/pages/TicketPage";
import UserList from "../features/user/pages/UserList";
import CalendarPage from "../features/calendar/pages/CalendarPage";
import PrivateRoute from "../routes/PrivateRoute";
import UnauthorizedPage from "../pages/UnauthorizedPage";
import EmployeeTicketPage from "../features/ticket/pages/EmployeeTicketsPage";
import RoomPage from "../features/room/pages/RoomPage";
import FeatureComingSoonPage from "../pages/FeatureComingSoonPage";
import EmployeePage from "../features/employee/pages/EmployeePage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      {/* Trang Coming Soon cho các module chưa hoàn thiện */}
      <Route path="/coming-soon" element={<FeatureComingSoonPage />} />

      {/* Private routes (Dashboard layout) */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Dashboard /> {/* Dashboard layout có Sidebar + <Outlet /> */}
          </PrivateRoute>
        }
      >
        <Route index element={<HomePage />} />

        {/* Chỉ ROLE_ADMIN mới được vào */}
        <Route
          path="rooms"
          element={
            <PrivateRoute roles={["ROLE_ADMIN"]}>
              <RoomPage />
            </PrivateRoute>
          }
        />

        {/* Chỉ ROLE_MANAGER & ROLE_ADMIN mới được vào */}
        <Route
          path="users"
          element={
            <PrivateRoute roles={["ROLE_MANAGER", "ROLE_ADMIN"]}>
              <UserList />
            </PrivateRoute>
          }
        />

        <Route
          path="departments"
          element={
            <PrivateRoute roles={["ROLE_MANAGER", "ROLE_ADMIN"]}>
              <FeatureComingSoonPage />
            </PrivateRoute>
          }
        />
        <Route
          path="tickets"
          element={
            <PrivateRoute roles={["ROLE_MANAGER", "ROLE_ADMIN"]}>
              <TicketsPage />
            </PrivateRoute>
          }
        />

        {/* Chỉ ROLE_HR & ROLE_MANAGER & ROLE_ADMIN mới được vào */}
        <Route
          path="employees"
          element={
            <PrivateRoute roles={["ROLE_MANAGER", "ROLE_ADMIN", "ROLE_HR"]}>
              <EmployeePage />
            </PrivateRoute>
          }
        />

        {/* Chỉ ROLE_USER mới được vào */}
        <Route
          path="my-tickets"
          element={
            <PrivateRoute roles={["ROLE_USER"]}>
              <EmployeeTicketPage />
            </PrivateRoute>
          }
        />
        <Route path="projects" element={<FeatureComingSoonPage />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="settings" element={<FeatureComingSoonPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
