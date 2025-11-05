import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect } from "react";
import {
    createLeaveBalance,
    deleteLeaveBalance,
    fetchLeaveBalances,
    updateLeaveBalance,
} from "../store/leaveBalanceSlice";
import { showError, showSuccess } from "../../../utils/toastUtils";

/**
 * Hook for managing Leave Balances
 * Provides: data, state, and CRUD actions
 */
export const useLeaveBalance = () => {
    const dispatch = useDispatch();
    const { items, loading, error } = useSelector((state) => state.leaveBalance);

    /* =============================
       INITIAL FETCH
    ============================= */
    useEffect(() => {
        dispatch(fetchLeaveBalances());
    }, [dispatch]);

    /* =============================
       CRUD ACTIONS
    ============================= */

    const create = useCallback(
        async (data) => {
            try {
                const res = await dispatch(createLeaveBalance(data));
                if (res.meta.requestStatus === "fulfilled") {
                    showSuccess("Leave Balance created successfully.");
                    dispatch(fetchLeaveBalances());
                } else {
                    const msg = res.payload?.message || "Failed to create leave Balance.";
                    showError(msg);
                }
                return res;
            } catch (err) {
                showError("An error occurred while creating the leave balance.");
                console.error(err);
            }
        },
        [dispatch]
    );

    const update = useCallback(
        async (id, data) => {
            try {
                const res = await dispatch(updateLeaveBalance({ id, data }));
                if (res.meta.requestStatus === "fulfilled") {
                    showSuccess("Leave Balance updated successfully.");
                    dispatch(fetchLeaveBalances());
                } else {
                    const msg = res.payload?.message || "Failed to update leave balance.";
                    showError(msg);
                }
                return res;
            } catch (err) {
                showError("An error occurred while updating the leave balance.");
                console.error(err);
            }
        },
        [dispatch]
    );

    const remove = useCallback(
        async (id) => {
            try {
                const res = await dispatch(deleteLeaveBalance(id));
                if (res.meta.requestStatus === "fulfilled") {
                    showSuccess("Leave Balance deleted successfully.");
                    dispatch(fetchLeaveBalances());
                } else {
                    const msg = res.payload?.message || "Failed to delete leave balance.";
                    showError(msg);
                }
                return res;
            } catch (err) {
                showError("An error occurred while deleting the leave balance.");
                console.error(err);
            }
        },
        [dispatch]
    );

    /* =============================
       RETURN HOOK VALUE
    ============================= */
    return {
        leaveBalances: items || [],
        loading,
        error,
        create,
        update,
        remove,
    };
};
