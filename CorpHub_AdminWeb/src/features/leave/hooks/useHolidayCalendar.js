import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect } from "react";
import {
    createHolidayCalendar,
    deleteHolidayCalendar,
    fetchHolidayCalendars,
    updateHolidayCalendar,
} from "../store/holidayCalendarSlice";
import { showError, showSuccess } from "../../../utils/toastUtils";

/**
 * Hook for managing Holidays
 * Provides: data, state, and CRUD actions
 */
export const useHolidayCalendar = () => {
    const dispatch = useDispatch();
    const { items, loading, error } = useSelector((state) => state.holiday);

    /* =============================
       INITIAL FETCH
    ============================= */
    useEffect(() => {
        dispatch(fetchHolidayCalendars());
    }, [dispatch]);

    /* =============================
       CRUD ACTIONS
    ============================= */

    const create = useCallback(
        async (data) => {
            try {
                const res = await dispatch(createHolidayCalendar(data));
                if (res.meta.requestStatus === "fulfilled") {
                    showSuccess("Holiday created successfully.");
                    dispatch(fetchHolidayCalendars());
                } else {
                    const msg = res.payload?.message || "Failed to create holiday.";
                    showError(msg);
                }
                return res;
            } catch (err) {
                showError("An error occurred while creating the holiday.");
                console.error(err);
            }
        },
        [dispatch]
    );

    const update = useCallback(
        async (id, data) => {
            try {
                const res = await dispatch(updateHolidayCalendar({ id, data }));
                if (res.meta.requestStatus === "fulfilled") {
                    showSuccess("Holiday updated successfully.");
                    dispatch(fetchHolidayCalendars());
                } else {
                    const msg = res.payload?.message || "Failed to update holiday.";
                    showError(msg);
                }
                return res;
            } catch (err) {
                showError("An error occurred while updating the holiday.");
                console.error(err);
            }
        },
        [dispatch]
    );

    const remove = useCallback(
        async (id) => {
            try {
                const res = await dispatch(deleteHolidayCalendar(id));
                if (res.meta.requestStatus === "fulfilled") {
                    showSuccess("Holiday deleted successfully.");
                    dispatch(fetchHolidayCalendars());
                } else {
                    const msg = res.payload?.message || "Failed to delete holiday.";
                    showError(msg);
                }
                return res;
            } catch (err) {
                showError("An error occurred while deleting the holiday.");
                console.error(err);
            }
        },
        [dispatch]
    );

    /* =============================
       RETURN HOOK VALUE
    ============================= */
    return {
        holidays: items || [],
        loading,
        error,
        create,
        update,
        remove,
    };
};
