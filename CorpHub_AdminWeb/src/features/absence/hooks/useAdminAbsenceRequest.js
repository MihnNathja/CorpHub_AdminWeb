import { useDispatch, useSelector } from "react-redux";
import { useEffect, useCallback } from "react";
import {
    fetchMyApprovals,
    approveOrRejectRequest,
} from "../store/absenceRequestSlice";

export const useAbsenceRequest = () => {
    const dispatch = useDispatch();
    const { items, loading, error } = useSelector(
        (state) => state.absenceRequest
    );

    /* =============================
       INITIAL FETCH
    ============================= */
    useEffect(() => {
        dispatch(fetchMyApprovals());
    }, [dispatch]);

    /* =============================
       ACTIONS (with useCallback)
    ============================= */

    const approveRequest = useCallback(
        async (instanceId, comment = "") => {
            await dispatch(
                approveOrRejectRequest({
                    instanceId,
                    approve: true,
                    comment,
                })
            );

            // Refresh list sau khi xử lý
            dispatch(fetchMyApprovals());
        },
        [dispatch]
    );

    const rejectRequest = useCallback(
        async (instanceId, comment = "") => {
            await dispatch(
                approveOrRejectRequest({
                    instanceId,
                    approve: false,
                    comment,
                })
            );

            // Refresh list sau khi xử lý
            dispatch(fetchMyApprovals());
        },
        [dispatch]
    );

    return {
        absenceRequests: items || [],
        loading,
        error,
        approveRequest,
        rejectRequest,
    };
};
