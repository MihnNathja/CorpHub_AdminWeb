import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, logoutAsync } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

export const useLoginForm = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, user } = useSelector((state) => state.auth);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(form));
  };

  // 🧭 Điều hướng sau khi login
  useEffect(() => {
    if (!user) return; // chưa có user => bỏ qua

    if (user.active === false) {
      // ❌ Tài khoản bị khóa
      dispatch(logoutAsync());
      navigate("/account-locked");
      return; // dừng luôn, tránh navigate("/")
    }

    // ✅ Đăng nhập thành công
    navigate("/");
  }, [user, dispatch, navigate]);

  return { form, handleChange, handleSubmit, loading, error };
};
