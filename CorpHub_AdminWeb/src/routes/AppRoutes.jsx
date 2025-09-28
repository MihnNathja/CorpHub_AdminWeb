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

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

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
        <Route path="tickets" element={
          <PrivateRoute roles={["ROLE_MANAGER", "ROLE_ADMIN"]}>
            <TicketsPage />
          </PrivateRoute>
        } />

        {/* Chỉ ROLE_MANAGER & ROLE_ADMIN mới được vào */}
        <Route
          path="users"
          element={
            <PrivateRoute roles={["ROLE_MANAGER", "ROLE_ADMIN"]}>
              <UserList />
            </PrivateRoute>
          }
        />

        {/* Chỉ ROLE_USER mới được vào */}
        <Route path="my-tickets" element={
          <PrivateRoute roles={["ROLE_USER"]}>
            <EmployeeTicketPage />
          </PrivateRoute>
        } />

        <Route path="calendar" element={<CalendarPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
