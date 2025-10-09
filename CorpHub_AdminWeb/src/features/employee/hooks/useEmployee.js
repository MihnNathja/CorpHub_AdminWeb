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
    data: employees = [],
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
  }, [fetchEmployees]);

  // ====================== ACTION: CREATE ======================
  const createProfile = async (profile, avatarFile) => {
    try {
      await dispatch(createEmployeeProfile({ profile, avatarFile })).unwrap();
      showSuccess("Create successfully");
      fetchEmployees(); // reload list
    } catch (err) {
      showError("Create failed");
      console.error("Create failed:", err);
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
    employees,
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
