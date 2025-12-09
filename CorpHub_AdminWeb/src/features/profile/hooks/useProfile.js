import { useDispatch, useSelector } from "react-redux";
import { useCallback, useState } from "react";
import {
  changePasswordAsync,
  getMyEmployeeProfileAsync,
  resetStatus,
  uploadAvatarAsync,
  updateMyContactInfoAsync,
} from "../store/profileSlice";
import {
  downloadDocumentAsync,
  uploadDocumentsAsync,
} from "../store/documentSlice";

export const useProfile = () => {
  const dispatch = useDispatch();
  const { profile, loading, success, error, uploading, uploadSuccess } =
    useSelector((state) => state.profile);

  const updatingContact = useSelector((state) => state.profile.updatingContact);

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

  const handleDownloadDocument = (documentId) => {
    if (!documentId) return;
    dispatch(downloadDocumentAsync(documentId));
  };

  // memoize to avoid re-creating the function each render (prevents repeated refetches)
  const fetchBasicInfo = useCallback(() => {
    dispatch(getMyEmployeeProfileAsync());
  }, [dispatch]);

  const updateContact = async (payload) => {
    const res = await dispatch(updateMyContactInfoAsync(payload));
    return res;
  };

  return {
    profile,
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
    handleDownloadDocument,
    fetchBasicInfo,
    updateContact,
    updatingContact,
  };
};
