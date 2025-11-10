import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect } from "react";
import {
    fetchAbsenceBalances,
} from "../store/absenceBalanceSlice";

/**
 * Hook for managing Absence Balances
 * Provides: data, state, and CRUD actions
 */
export const useAbsenceBalance = () => {
    const dispatch = useDispatch();
    const { items, loading, error } = useSelector((state) => state.absenceBalance);

    /* =============================
       INITIAL FETCH
    ============================= */
    useEffect(() => {
        dispatch(fetchAbsenceBalances());
    }, [dispatch]);


    /* =============================
       RETURN HOOK VALUE
    ============================= */
    return {
        absenceBalances: items || [],
        loading,
        error,
    };
};
