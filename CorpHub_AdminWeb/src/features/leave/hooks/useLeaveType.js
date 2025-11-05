import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect } from "react";
import {
    createLeaveType,
    deleteLeaveType,
    fetchLeaveTypes,
    updateLeaveType,
} from "../store/leaveTypeSlice";
import { showError, showSuccess } from "../../../utils/toastUtils";

/**
 * Hook for managing Leave Types
 * Provides: data, state, and CRUD actions
 */
export const useLeaveType = () => {
    const dispatch = useDispatch();
    const { items, loading, error } = useSelector((state) => state.leaveType);

    /* =============================
       INITIAL FETCH
    ============================= */
    useEffect(() => {
        dispatch(fetchLeaveTypes());
    }, [dispatch]);

    /* =============================
       CRUD ACTIONS
    ============================= */

    const create = useCallback(
        async (data) => {
            try {
                const res = await dispatch(createLeaveType(data));
                if (res.meta.requestStatus === "fulfilled") {
                    showSuccess("Leave type created successfully.");
                    dispatch(fetchLeaveTypes());
                } else {
                    const msg = res.payload?.message || "Failed to create leave type.";
                    showError(msg);
                }
                return res;
            } catch (err) {
                showError("An error occurred while creating the leave type.");
                console.error(err);
            }
        },
        [dispatch]
    );

    const update = useCallback(
        async (id, data) => {
            try {
                const res = await dispatch(updateLeaveType({ id, data }));
                if (res.meta.requestStatus === "fulfilled") {
                    showSuccess("Leave type updated successfully.");
                    dispatch(fetchLeaveTypes());
                } else {
                    const msg = res.payload?.message || "Failed to update leave type.";
                    showError(msg);
                }
                return res;
            } catch (err) {
                showError("An error occurred while updating the leave type.");
                console.error(err);
            }
        },
        [dispatch]
    );

    const remove = useCallback(
        async (id) => {
            try {
                const res = await dispatch(deleteLeaveType(id));
                if (res.meta.requestStatus === "fulfilled") {
                    showSuccess("Leave type deleted successfully.");
                    dispatch(fetchLeaveTypes());
                } else {
                    const msg = res.payload?.message || "Failed to delete leave type.";
                    showError(msg);
                }
                return res;
            } catch (err) {
                showError("An error occurred while deleting the leave type.");
                console.error(err);
            }
        },
        [dispatch]
    );

    /* =============================
       RETURN HOOK VALUE
    ============================= */
    return {
        leaveTypes: items || [],
        loading,
        error,
        create,
        update,
        remove,
    };
};
