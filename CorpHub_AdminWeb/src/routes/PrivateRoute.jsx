import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";

const PrivateRoute = ({ children, roles }) => {
  const { accessToken, user } = useSelector((state) => state.auth);

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

  // ⏳ Nếu cần roles mà user chưa load
  if (roles && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 dark:text-gray-300">Đang tải thông tin người dùng...</p>
      </div>
    );
  }

  // ❌ Sai quyền
  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // ✅ OK
  return children || <Outlet />;
};

export default PrivateRoute;
