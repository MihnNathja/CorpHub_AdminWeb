import { Routes, Route } from "react-router-dom";
import LoginPage from "../features/auth/pages/LoginPage";
import HomePage from "../pages/HomePage";
import Dashboard from "../pages/DashBoard";
import TicketsPage from "../features/ticket/pages/TicketPage";
import UserList from "../features/user/pages/UserList";
import PrivateRoute from "../routes/PrivateRoute";
import CalendarPage from "../features/calendar/pages/CalendarPage";
import EmployeePage from "../features/employee/pages/EmployeePage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Private routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Dashboard />}>
          <Route index element={<HomePage />} />
          <Route path="tickets" element={<TicketsPage />} />
          <Route path="users" element={<UserList />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="employee" element={<EmployeePage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
