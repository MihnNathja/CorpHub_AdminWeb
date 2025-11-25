// src/features/department/hooks/useDepartmentManagement.js
import { useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDepartments,
  loadDepartmentsWithUsers,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  setManager,
  moveDepartment,
} from "../store/departmentSlice";

export const useDepartmentManagement = () => {
  const dispatch = useDispatch();
  const { departments, loading, error } = useSelector(
    (state) => state.department
  );

  // 🔄 Tải danh sách phòng ban khi mount
  useEffect(() => {
    dispatch(loadDepartmentsWithUsers());
  }, [dispatch]);

  // 🧠 Memo hóa dữ liệu để tránh re-render thừa
  const stableDepartments = useMemo(() => departments || [], [departments]);

  // 🔁 Tải lại danh sách (dùng cho nút refresh)
  const reload = useCallback(() => {
    dispatch(loadDepartmentsWithUsers());
  }, [dispatch]);

  // ➕ Thêm phòng ban
  const handleCreate = useCallback(
    async (data) => {
      try {
        await dispatch(createDepartment(data)).unwrap();
        reload();
      } catch (err) {
        console.error("Create department failed:", err);
        throw err;
      }
    },
    [dispatch, reload]
  );

  // ✏️ Cập nhật phòng ban
  const handleUpdate = useCallback(
    async (id, data) => {
      try {
        await dispatch(updateDepartment({ id, data })).unwrap();
        reload();
      } catch (err) {
        console.error("Update department failed:", err);
        throw err;
      }
    },
    [dispatch, reload]
  );

  // ❌ Xóa phòng ban
  const handleDelete = useCallback(
    async (id) => {
      try {
        await dispatch(deleteDepartment(id)).unwrap();
        reload();
      } catch (err) {
        console.error("Delete department failed:", err);
        throw err;
      }
    },
    [dispatch, reload]
  );

  // 👤 Gán trưởng phòng (manager)
  const handleAssignManager = useCallback(
    async (departmentId, managerId) => {
      try {
        await dispatch(
          setManager({
            departmentId,
            managerId,
          })
        ).unwrap();
        reload();
      } catch (err) {
        console.error("Assign manager failed:", err);
        throw err;
      }
    },
    [dispatch, reload]
  );

  // Di chuyển phòng ban
  const handleMove = useCallback(
    async (dragId, newParentId) => {
      try {
        await dispatch(moveDepartment({ dragId, newParentId })).unwrap();
        reload(); // Quan trọng – load lại cây phòng ban
      } catch (err) {
        console.error("Move department failed:", err);
        throw err;
      }
    },
    [dispatch, reload]
  );

  return {
    departments: stableDepartments,
    loading,
    error,
    reload,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleAssignManager,
    handleMove,
  };
};
