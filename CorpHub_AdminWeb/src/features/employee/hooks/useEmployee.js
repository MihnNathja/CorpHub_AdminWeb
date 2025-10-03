import { useDispatch, useSelector } from "react-redux";
import {
  createEmployeeProfile,
  getAllEmployeeProfile,
} from "../store/employeeSlice";
import { showSuccess, showError } from "../../../utils/toastUtils";
import { useEffect } from "react";

export const useEmployee = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.employees);

  useEffect(() => {
    dispatch(getAllEmployeeProfile());
  }, [dispatch]);

  const createProfile = async (profile, avatarFile) => {
    try {
      await dispatch(createEmployeeProfile({ profile, avatarFile })).unwrap();
      showSuccess("Create successfully");
    } catch (err) {
      showError("Create failed");
      console.error("Create failed:", err);
    }
  };

  return { createProfile, loading, error };
};
