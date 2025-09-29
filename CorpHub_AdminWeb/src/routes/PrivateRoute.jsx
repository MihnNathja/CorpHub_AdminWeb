// src/routes/PrivateRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { logout } from "../features/auth/store/authSlice";

const PrivateRoute = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      // exp trong JWT là giây, Date.now() là ms
      return decoded.exp * 1000 < Date.now();
    } catch (err) {
      return true; // token lỗi → coi như hết hạn
    }
  };

  if (!token || isTokenExpired(token)) {
    dispatch(logout()); // clear redux + localStorage
    return <Navigate to="/login" replace />;
  }

  // ✅ Cho phép render các route con
  return <Outlet />;
};

export default PrivateRoute;
