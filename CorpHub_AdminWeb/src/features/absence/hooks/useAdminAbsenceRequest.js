import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
    fetchAbsenceRequests,
} from "../store/absenceRequestSlice";

/**
 * Hook for managing Absence Requests
 * Provides: data, state, and CRUD actions
 */
export const useAbsenceRequest = () => {
    const dispatch = useDispatch();
    const { items, loading, error } = useSelector((state) => state.absenceRequest);

    /* =============================
       INITIAL FETCH
    ============================= */

    useEffect(() => {
        dispatch(fetchAbsenceRequests());
    }, [dispatch]);

    return {
        absenceRequests: items || [],
        loading,
        error,
    };
};
