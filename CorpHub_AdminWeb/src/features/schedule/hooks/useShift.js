import { useDispatch, useSelector } from "react-redux";
import { useState, useCallback, useEffect } from "react";
import {
    createShift,
    deleteShift,
    fetchShifts,
    updateShift,
} from "../store/shiftSlice";
import { showError, showSuccess } from "../../../utils/toastUtils";

/**
 * Hook for managing Shifts (Admin)
 */
export const useShift = () => {
    const dispatch = useDispatch();
    const { items, meta = {}, loading, error } = useSelector(
        (state) => state.shift
    );

    // Pagination
    const [page, setPage] = useState(meta.page ?? 0);
    const [size, setSize] = useState(meta.size ?? 10);

    // Filters
    const [filters, setFilters] = useState({
        keywords: "",
        isNightShift: "",
        startFrom: "",
        endTo: "",
    });

    /**
     * Call API when page/size or filter changes
     */
    useEffect(() => {
        dispatch(
            fetchShifts({
                page,
                size,
                ...filters
            })
        );

    }, [dispatch, page, size, filters]);

    /**
     * Create
     */
    const create = useCallback(
        async (data) => {
            try {
                const res = await dispatch(createShift(data));
                if (res.meta.requestStatus === "fulfilled") {
                    showSuccess("Shift added successfully!");
                    dispatch(
                        fetchShifts({
                            page,
                            size,
                            ...filters,
                        })
                    );
                } else {
                    showError(res.payload?.message || "Cannot create shift!");
                }
                return res;
            } catch (err) {
                console.error(err);
                showError("Error creating shift!");
            }
        },
        [dispatch, page, size, filters]
    );

    /**
     * Update
     */
    const update = useCallback(
        async (id, data) => {
            try {
                const res = await dispatch(updateShift({ id, data }));
                if (res.meta.requestStatus === "fulfilled") {
                    showSuccess("Shift updated successfully!");
                    dispatch(fetchShifts({ page, size, ...filters }));
                } else {
                    showError(res.payload?.message || "Cannot update shift!");
                }
                return res;
            } catch (err) {
                console.error(err);
                showError("Error updating shift!");
            }
        },
        [dispatch, page, size, filters]
    );

    /**
     * Delete
     */
    const remove = useCallback(
        async (id) => {
            try {
                const res = await dispatch(deleteShift(id));
                if (res.meta.requestStatus === "fulfilled") {
                    showSuccess("Shift deleted successfully!");
                    dispatch(fetchShifts({ page, size, ...filters }));
                } else {
                    showError(res.payload?.message || "Cannot delete shift!");
                }
                return res;
            } catch (err) {
                console.error(err);
                showError("Error deleting shift!");
            }
        },
        [dispatch, page, size, filters]
    );

    return {
        shifts: items || [],
        meta,
        loading,
        error,
        page,
        setPage,
        size,
        setSize,
        filters,
        setFilters,
        create,
        update,
        remove,
    };
};
