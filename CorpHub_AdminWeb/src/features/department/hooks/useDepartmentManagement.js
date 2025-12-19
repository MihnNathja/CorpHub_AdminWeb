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
import { showSuccess } from "../../../utils/toastUtils";

export const useDepartmentManagement = () => {
  const dispatch = useDispatch();
  const { departments, loading, error } = useSelector(
    (state) => state.department
  );

  // 🔄 Load departments when the hook mounts
  useEffect(() => {
    dispatch(loadDepartmentsWithUsers());
  }, [dispatch]);

  // 🧠 Memoize data to prevent unnecessary re-renders
  const stableDepartments = useMemo(() => departments || [], [departments]);

  // 🔁 Reload list (used by the refresh button)
  const reload = useCallback(() => {
    dispatch(loadDepartmentsWithUsers());
  }, [dispatch]);

  // ➕ Create department
  const handleCreate = useCallback(
    async (data) => {
      try {
        await dispatch(createDepartment(data)).unwrap();
        showSuccess("Department created successfully");
        reload();
      } catch (err) {
        console.error("Create department failed:", err);
        throw err;
      }
    },
    [dispatch, reload]
  );

  // ✏️ Update department
  const handleUpdate = useCallback(
    async (id, data) => {
      try {
        await dispatch(updateDepartment({ id, data })).unwrap();
        showSuccess("Department updated successfully");
        reload();
      } catch (err) {
        console.error("Update department failed:", err);
        throw err;
      }
    },
    [dispatch, reload]
  );

  // ❌ Delete department
  const handleDelete = useCallback(
    async (id) => {
      try {
        await dispatch(deleteDepartment(id)).unwrap();
        showSuccess("Department deleted successfully");
        reload();
      } catch (err) {
        console.error("Delete department failed:", err);
        throw err;
      }
    },
    [dispatch, reload]
  );

  // 👤 Assign department manager
  const handleAssignManager = useCallback(
    async (departmentId, managerId) => {
      try {
        await dispatch(
          setManager({
            departmentId,
            managerId,
          })
        ).unwrap();
        showSuccess("Manager assigned successfully");
        reload();
      } catch (err) {
        console.error("Assign manager failed:", err);
        throw err;
      }
    },
    [dispatch, reload]
  );

  // Move department
  const handleMove = useCallback(
    async (dragId, newParentId) => {
      try {
        await dispatch(moveDepartment({ dragId, newParentId })).unwrap();
        showSuccess("Department moved successfully");
        reload(); // Important — reload the department tree
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
