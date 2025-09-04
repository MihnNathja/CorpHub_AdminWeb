import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/authSlice";
import LoginForm from "../components/LoginForm";

const LoginPage = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleLogin = (formData) => {
    dispatch(login(formData));
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md">
        {error && <p className="text-red-500 mb-2">{error}</p>}
        {loading ? <p className="text-center">Logging in...</p> : <LoginForm onSubmit={handleLogin} />}
      </div>
    </div>
  );
};

export default LoginPage;
