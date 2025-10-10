// src/hooks/usePermission.js

import { useAuth } from "../features/auth/hooks/useAuth";

export function usePermission() {
  const { user } = useAuth();

  // ✅ Giả lập dữ liệu permission (sau này sẽ thay bằng server trả về)
  const permissions = user?.permissions || []; // tương lai backend trả array này

  // Nếu chưa có module phân quyền, tạm logic role-based
  const role = user?.role;
  const department = user?.department;

  // ⚙️ Quy tắc quyền hiện tại (role/department)
  const canViewAccountRequests =
    (department === "Phòng IT" &&
      ["ROLE_ADMIN", "ROLE_MANAGER"].includes(role)) ||
    permissions.includes("VIEW_ACCOUNT_REQUESTS");

  const canManageTickets =
    ["ADMIN", "IT_ADMIN"].includes(role) ||
    permissions.includes("MANAGE_TICKETS");

  const canEditEmployeeProfile =
    role === "HR_ADMIN" || permissions.includes("EDIT_EMPLOYEE_PROFILE");

  // ✅ Trả về các quyền được chuẩn hóa
  return {
    canViewAccountRequests,
    canManageTickets,
    canEditEmployeeProfile,
  };
}
