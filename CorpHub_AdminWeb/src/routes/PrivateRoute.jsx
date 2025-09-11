import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { logout } from "../features/auth/store/authSlice"; // import action logout nếu có

const PrivateRoute = ({ children }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      // exp trong JWT là đơn vị giây, Date.now() là ms
      return decoded.exp * 1000 < Date.now();
    } catch (err) {
      return true; // token không hợp lệ => coi như hết hạn
    }
  };

  if (!token || isTokenExpired(token)) {
    dispatch(logout()); // xoá token trong redux + localStorage
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
