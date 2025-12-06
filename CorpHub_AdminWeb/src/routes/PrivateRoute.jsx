import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import UnauthorizedPage from "../pages/UnauthorizedPage";

// Define role requirements for each route - aligned with SideBar roles
const ROUTE_ROLES = {
  "/attendance": ["ROLE_ADMIN", "ROLE_MANAGER", "ROLE_HR"],
  "/rooms": ["ROLE_ADMIN"],
  "/assets": ["ROLE_ADMIN", "ROLE_MANAGER"],
  "/users": ["ROLE_ADMIN", "ROLE_MANAGER"],
  "/roles": ["ROLE_ADMIN"],
  "/departments": ["ROLE_ADMIN"],
  "/tickets": ["ROLE_ADMIN", "ROLE_MANAGER"],
  "/employees": ["ROLE_ADMIN", "ROLE_MANAGER", "ROLE_HR"],
  "/my-tickets": ["ROLE_USER"],
  "/projects": ["ROLE_ADMIN", "ROLE_MANAGER"],
  "/calendar": ["ROLE_ADMIN", "ROLE_MANAGER", "ROLE_USER", "ROLE_HR"],
  "/settings": ["ROLE_ADMIN"],
  "/profile": ["ROLE_ADMIN", "ROLE_MANAGER", "ROLE_USER", "ROLE_HR"],
  "/absence": ["ROLE_ADMIN", "ROLE_MANAGER", "ROLE_HR"],
  "/my-absence": ["ROLE_USER"],
  "/schedule": ["ROLE_ADMIN", "ROLE_HR"],
  "/workflow": ["ROLE_ADMIN"],
};

const PrivateRoute = ({ children }) => {
  const { accessToken, user } = useSelector((state) => state.auth);
  const location = useLocation();

  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  };

  // 🔒 Nếu không có token hoặc token hết hạn → về login
  if (!accessToken || isTokenExpired(accessToken)) {
    return <Navigate to="/login" replace />;
  }

  // ⏳ Nếu user chưa load
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 dark:text-gray-300">
          Đang tải thông tin người dùng...
        </p>
      </div>
    );
  }

  // 🔒 Nếu tài khoản bị khóa → về account-locked
  if (!user.active) {
    return <Navigate to="/account-locked" replace />;
  }

  // ❌ Kiểm tra quyền truy cập route
  const requiredRoles = ROUTE_ROLES[location.pathname];
  if (requiredRoles && !requiredRoles.includes(user.role)) {
    return <UnauthorizedPage />;
  }

  // ✅ OK - cho phép vào
  return children || <Outlet />;
};

export default PrivateRoute;
