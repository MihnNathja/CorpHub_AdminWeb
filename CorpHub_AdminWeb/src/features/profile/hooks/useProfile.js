import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { changePasswordAsync, resetStatus } from "../store/profileSlice";

export const useProfile = () => {
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((state) => state.profile);

  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(changePasswordAsync(form));
  };

  const reset = () => dispatch(resetStatus());

  return {
    form,
    handleChange,
    handleSubmit,
    loading,
    success,
    error,
    reset,
  };
};
