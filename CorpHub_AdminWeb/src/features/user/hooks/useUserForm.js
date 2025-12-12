// src/features/user/hooks/useUserForm.js
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDepartments } from "../store/userSlice";
import useRoles from "./useRoles";

export const useUserForm = (isOpen, user, onSubmit) => {
  const dispatch = useDispatch();
  const { departments } = useSelector((state) => state.user);
  const { roles, rolesLoading } = useRoles();

  const [form, setForm] = useState({
    id: "",
    fullName: "",
    email: "",
    role: "",
    password: "",
  });

  useEffect(() => {
    if (!isOpen) return;

    dispatch(fetchDepartments());

    if (user) {
      // Edit mode
      // Chỗ bên dưới sẽ còn cần bổ sung
      setForm({
        employeeId: user.id || "",
        email: user.email || "",
        role: user.role || "",
        password: "",
      });
    } else {
      // Add mode
      setForm({
        employeeId: "",
        email: "",
        role: "",
        password: "",
      });
    }
  }, [isOpen, user, dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form, !!user);
  };

  return {
    form,
    setForm,
    handleChange,
    handleSubmit,
    departments,
    roles,
    rolesLoading,
  };
};
