// src/features/user/hooks/useUserForm.js
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDepartments } from "../store/userSlice";

export const useUserForm = (isOpen, user, onSubmit) => {
  const dispatch = useDispatch();
  const { departments } = useSelector((state) => state.user);


  const [form, setForm] = useState({
    fullName: "",
    email: "",
    role: "",
    password: "",
    departmentId: "",
  });

  const roles = ["Admin", "Manager", "Employee"]; // Hoặc fetch từ backend nếu cần

  // Load departments và set form khi modal mở
  useEffect(() => {
    if (!isOpen) return;

    dispatch(fetchDepartments());

    if (user) {
      // Edit
      setForm({
        fullName: user.fullName || "",
        email: user.email || "",
        role: user.role || "",
        password: "", // trống khi edit
        departmentId: user.department?.id || "",
      });
    } else {
      // Add
      setForm({ fullName: "", email: "", role: "", password: "", departmentId: "" });
    }
  }, [isOpen, user, dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form, !!user); // thứ hai là cờ edit/add
  };

  return { form, setForm, handleChange, handleSubmit, departments, roles };
};
