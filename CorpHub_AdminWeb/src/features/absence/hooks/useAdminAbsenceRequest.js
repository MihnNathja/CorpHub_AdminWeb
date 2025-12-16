import { useDispatch, useSelector } from "react-redux";
import { useEffect, useCallback, useState } from "react";
import {
    fetchMyApprovals,
    approveOrRejectRequest,
} from "../store/absenceRequestSlice";
import { showSuccess, showError } from "../../../utils/toastUtils";

export const useAbsenceRequest = () => {
    const dispatch = useDispatch();
    const { items, meta = {}, loading, error } = useSelector(
        (state) => state.absenceRequest
    );
    const [page, setPage] = useState(meta.page ?? 0);
    const [size, setSize] = useState(meta.size ?? 9);
    const [filter, setFilter] = useState({});

    /* =============================
       INITIAL FETCH
    ============================= */
    useEffect(() => {
        dispatch(fetchMyApprovals({ page, size, ...filter }));
    }, [dispatch, page, size, filter]);

    /* =============================
       ACTIONS (with useCallback)
    ============================= */

    const approveRequest = useCallback(
        async (instanceId, comment = "") => {
            try {
                const result = await dispatch(
                    approveOrRejectRequest({
                        instanceId,
                        approve: true,
                        comment,
                    })
                );

                // ✅ Kiểm tra requestStatus
                if (result.meta.requestStatus === "fulfilled") {
                    showSuccess("Request approved successfully!");
                    dispatch(fetchMyApprovals());
                } else {
                    showError(result.payload?.message || "Cannot approve request!");
                }
                return result;
            } catch (err) {
                console.error(err);
                showError("Error approving request!");
            }
        },
        [dispatch]
    );

    const rejectRequest = useCallback(
        async (instanceId, comment = "") => {
            try {
                const result = await dispatch(
                    approveOrRejectRequest({
                        instanceId,
                        approve: false,
                        comment,
                    })
                );

                // ✅ Kiểm tra requestStatus
                if (result.meta.requestStatus === "fulfilled") {
                    showSuccess("Request rejected successfully!");
                    dispatch(fetchMyApprovals());
                } else {
                    showError(result.payload?.message || "Cannot reject request!");
                }
                return result;
            } catch (err) {
                console.error(err);
                showError("Error rejecting request!");
            }
        },
        [dispatch]
    );

    return {
        absenceRequests: items || [],
        loading,
        error,
        filter,
        setFilter,
        approveRequest,
        rejectRequest,
    };
};
