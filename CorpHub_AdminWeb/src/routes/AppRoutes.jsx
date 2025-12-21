import { Routes, Route } from "react-router-dom";
import LoginPage from "../features/auth/pages/LoginPage";
import Dashboard from "../pages/Dashboard";
import HomePageLayout from "../pages/HomePageLayout";
import TicketsPage from "../features/ticket/pages/TicketPage";
import CalendarPage from "../features/calendar/pages/CalendarPage";
import PrivateRoute from "../routes/PrivateRoute";
import UnauthorizedPage from "../pages/UnauthorizedPage";
import EmployeeTicketPage from "../features/ticket/pages/EmployeeTicketsPage";
import RoomPage from "../features/room/pages/RoomPage";
import FeatureComingSoonPage from "../pages/FeatureComingSoonPage";
import EmployeePage from "../features/employee/pages/EmployeePage";
import EmployeeDetailPage from "../features/employee/pages/EmployeeDetailPage";
import UserPage from "../features/user/pages/UserPage";
import RolesPage from "../features/role/pages/RolesPage";
import DepartmentManagementPage from "../features/department/pages/DepartmentManagementPage";
import AccountLockedPage from "../pages/AccountLockedPage";
import EmployeeProfilePage from "../features/profile/pages/EmployeeProfilePage";
import AssetPage from "../features/asset/page/AssetPage";
import AdminSettingsPage from "../features/settings/pages/AdminSettingPage";
import AbsenceAdminPage from "../features/absence/pages/AbsenceAdminPage";
import AbsenceEmployeePage from "../features/absence/pages/AbsenceEmployeePage";
import SchedulePage from "../features/schedule/pages/SchedulePage";
import AttendancePage from "../features/attendance/pages/AttendancePage";
import WorkflowPage from "../features/workflow/pages/WorkflowPage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/coming-soon" element={<FeatureComingSoonPage />} />
      <Route path="/account-locked" element={<AccountLockedPage />} />

      {/* ✅ Private routes — chỉ 1 lớp PrivateRoute */}
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<HomePageLayout />}>
          <Route index element={<FeatureComingSoonPage />} />
          <Route path="attendance" element={<AttendancePage />} />
          <Route path="rooms" element={<RoomPage />} />
          <Route path="assets" element={<AssetPage />} />
          <Route path="users" element={<UserPage />} />
          <Route path="roles" element={<RolesPage />} />
          <Route path="departments" element={<DepartmentManagementPage />} />
          <Route path="tickets" element={<TicketsPage />} />
          <Route path="employees" element={<EmployeePage />} />
          <Route path="employees/:id" element={<EmployeeDetailPage />} />
          <Route path="my-tickets" element={<EmployeeTicketPage />} />
          <Route path="projects" element={<FeatureComingSoonPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
          <Route path="profile" element={<EmployeeProfilePage />} />
          <Route path="absence" element={<AbsenceAdminPage />} />
          <Route path="my-absence" element={<AbsenceEmployeePage />} />
          <Route path="schedule" element={<SchedulePage />} />
          <Route path="workflow" element={<WorkflowPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
