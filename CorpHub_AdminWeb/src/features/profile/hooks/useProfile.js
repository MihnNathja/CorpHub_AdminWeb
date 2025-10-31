import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import {
  changePasswordAsync,
  resetStatus,
  uploadAvatarAsync,
  uploadDocumentsAsync,
} from "../store/profileSlice";

export const useProfile = () => {
  const dispatch = useDispatch();
  const { loading, success, error, uploading, uploadSuccess } = useSelector(
    (state) => state.profile
  );

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

  const handleUploadAvatar = (file) => {
    if (!file) return;
    dispatch(uploadAvatarAsync(file));
  };

  const handleUploadDocument = (formData) => {
    if (!formData) return;
    dispatch(uploadDocumentsAsync(formData));
  };

  return {
    form,
    handleChange,
    handleSubmit,
    loading,
    success,
    error,
    reset,
    uploading,
    uploadSuccess,
    handleUploadAvatar,
    handleUploadDocument,
  };
};
