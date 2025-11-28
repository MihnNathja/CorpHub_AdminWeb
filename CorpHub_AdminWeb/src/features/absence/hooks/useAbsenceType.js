import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect } from "react";
import {
    createAbsenceType,
    deleteAbsenceType,
    fetchAbsenceTypes,
    updateAbsenceType,
} from "../store/absenceTypeSlice";
import { showError, showSuccess } from "../../../utils/toastUtils";

/**
 * Hook for managing Absence Types
 * Provides: data, state, and CRUD actions
 */
export const useAbsenceType = () => {
    const dispatch = useDispatch();
    const { items, loading, error } = useSelector((state) => state.absenceType);

    /* =============================
       INITIAL FETCH
    ============================= */
    useEffect(() => {
        dispatch(fetchAbsenceTypes());
    }, [dispatch]);

    /* =============================
       CRUD ACTIONS
    ============================= */

    const create = useCallback(
        async (data) => {
            try {
                const res = await dispatch(createAbsenceType(data));
                if (res.meta.requestStatus === "fulfilled") {
                    showSuccess("Absence type created successfully.");
                    dispatch(fetchAbsenceTypes());
                } else {
                    const msg = res.payload?.message || "Failed to create absence type.";
                    showError(msg);
                }
                return res;
            } catch (err) {
                showError("An error occurred while creating the absence type.");
                console.error(err);
            }
        },
        [dispatch]
    );

    const update = useCallback(
        async (id, data) => {
            try {
                const res = await dispatch(updateAbsenceType({ id, data }));
                if (res.meta.requestStatus === "fulfilled") {
                    showSuccess("Absence type updated successfully.");
                    dispatch(fetchAbsenceTypes());
                } else {
                    const msg = res.payload?.message || "Failed to update absence type.";
                    showError(msg);
                }
                return res;
            } catch (err) {
                showError("An error occurred while updating the absence type.");
                console.error(err);
            }
        },
        [dispatch]
    );

    const remove = useCallback(
        async (id) => {
            try {
                const res = await dispatch(deleteAbsenceType(id));
                if (res.meta.requestStatus === "fulfilled") {
                    showSuccess("Absence type deleted successfully.");
                    dispatch(fetchAbsenceTypes());
                } else {
                    const msg = res.payload?.message || "Failed to delete absence type.";
                    showError(msg);
                }
                return res;
            } catch (err) {
                showError("An error occurred while deleting the absence type.");
                console.error(err);
            }
        },
        [dispatch]
    );

    /* =============================
       RETURN HOOK VALUE
    ============================= */
    return {
        absenceTypes: items || [],
        loading,
        error,
        create,
        update,
        remove,
    };
};
