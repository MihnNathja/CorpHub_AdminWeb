import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);
  console.log("PrivateRoute token:", token);
  return token ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
