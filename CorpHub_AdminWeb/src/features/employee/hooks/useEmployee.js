import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createEmployeeProfile,
  createEmployeeProfileTicket,
  getAllEmployeeProfile,
} from "../store/employeeSlice";
import { showSuccess, showError } from "../../../utils/toastUtils";

export const useEmployee = () => {
  const dispatch = useDispatch();

  // Lấy dữ liệu từ redux
  const {
    data,
    meta = {},
    loading,
    error,
  } = useSelector((state) => state.employees);

  // ====================== LOCAL FILTER STATE ======================
  const [page, setPage] = useState(meta.page ?? 0);
  const [size, setSize] = useState(meta.size ?? 10);
  const [keyword, setKeyword] = useState("");

  const totalPages = meta.totalPages ?? 1;

  // ====================== FETCH FUNCTION ======================
  const fetchEmployees = useCallback(() => {
    const params = {
      page,
      size,
      keyword,
    };
    console.log(params);
    dispatch(getAllEmployeeProfile(params));
  }, [dispatch, page, size, keyword]);

  // Gọi khi filter hoặc phân trang thay đổi
  useEffect(() => {
    fetchEmployees();
    console.log(data);
  }, [fetchEmployees]);

  // ====================== ACTION: CREATE ======================
  const createProfile = async (profile) => {
    try {
      const res = await dispatch(createEmployeeProfile(profile)).unwrap();
      showSuccess(res?.message || "Create employee successfully");
      fetchEmployees();
      return res;
    } catch (err) {
      const message = err?.message || err?.error || "Create failed";
      showError(message);
      console.error("Create failed:", err);
      throw err;
    }
  };

  const sendCreateUserTicket = async (selectedUsers) => {
    try {
      await dispatch(
        createEmployeeProfileTicket({ employeeIds: selectedUsers })
      ).unwrap();
      showSuccess("Create successfully");
      fetchEmployees(); // reload list
    } catch (err) {
      showError("Create failed");
      console.error("Create failed:", err);
    }
  };

  // ====================== RETURN ======================
  return {
    data,
    loading,
    error,

    // Pagination
    page,
    setPage,
    totalPages,
    size,
    setSize,

    // Filters
    keyword,
    setKeyword,

    // Actions
    createProfile,
    fetchEmployees,
    sendCreateUserTicket,
  };
};
