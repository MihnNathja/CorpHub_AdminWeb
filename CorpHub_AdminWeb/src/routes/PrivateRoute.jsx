// src/routes/PrivateRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { logout } from "../features/auth/store/authSlice";

const PrivateRoute = ({ children, roles }) => {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);

  // ✅ Kiểm tra token có hợp lệ không
  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 < Date.now();
    } catch (e) {
      return true; // Token không decode được -> xem như hết hạn
    }
  };

  if (!token || isTokenExpired(token)) {
    // Chỉ logout khi token thật sự hết hạn / lỗi
    dispatch(logout());
    return <Navigate to="/login" replace />;
  }

  // Nếu route yêu cầu roles mà user chưa load -> show loader thay vì render children
  if (roles && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 dark:text-gray-300">Đang tải thông tin người dùng...</p>
      </div>
    );
  }

  // Nếu roles được truyền mà user đã load và không match -> chỉ redirect
  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default PrivateRoute;
