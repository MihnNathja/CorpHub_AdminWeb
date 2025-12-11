import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import {
  fetchInternalWorkHistories,
  createInternalWorkHistory,
} from "../store/internalWorkHistorySlice";
import { showError, showSuccess } from "../../../utils/toastUtils";

/**
 * Hook quản lý Internal Work History
 */
export const useInternalWorkHistory = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector(
    (state) => state.internalWorkHistory
  );

  /**
   * Lấy danh sách lịch sử làm việc theo employeeId
   */
  const getHistoriesByEmployee = useCallback(
    async (employeeId) => {
      try {
        const res = await dispatch(fetchInternalWorkHistories(employeeId));
        if (res.meta.requestStatus === "fulfilled") {
          return res.payload;
        } else {
          showError(res.payload?.message || "Không thể tải lịch sử làm việc");
        }
      } catch (err) {
        console.error(err);
        showError("Lỗi khi tải lịch sử làm việc");
      }
    },
    [dispatch]
  );

  /**
   * Tạo mới lịch sử làm việc
   */
  const createHistory = useCallback(
    async (data) => {
      try {
        const res = await dispatch(createInternalWorkHistory(data));
        if (res.meta.requestStatus === "fulfilled") {
          showSuccess("Tạo lịch sử làm việc thành công!");
          return res.payload;
        } else {
          showError(res.payload?.message || "Không thể tạo lịch sử làm việc");
        }
      } catch (err) {
        console.error(err);
        showError("Lỗi khi tạo lịch sử làm việc");
      }
    },
    [dispatch]
  );

  return {
    histories: items,
    loading,
    error,
    getHistoriesByEmployee,
    createHistory,
  };
};
