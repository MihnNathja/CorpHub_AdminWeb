import { useDispatch, useSelector } from "react-redux";
import {
    fetchRoomRequirements,
    approveRoomRequirement,
    rejectRoomRequirement,
    setSelectedRequirement,
    clearSelectedRequirement,
} from "../store/roomRequirementSlice";
import { useCallback, useEffect } from "react";
import { showSuccess, showError } from "../../../utils/toastUtils";

export function useRoomRequirement(autoFetch = true) {
    const dispatch = useDispatch();

    // ✅ Khớp với slice mới
    const { items, loading, error, selected, meta } = useSelector(
        (state) => state.roomRequirements
    );

    /* -------------------- LOAD DỮ LIỆU -------------------- */
    const refresh = useCallback(
        (page = meta?.page || 0, size = meta?.size || 9) => {
            dispatch(fetchRoomRequirements({ page, size }));
        },
        [dispatch, meta?.page, meta?.size]
    );

    useEffect(() => {
        if (autoFetch) refresh();
    }, [autoFetch, refresh]);

    /* -------------------- HÀNH ĐỘNG -------------------- */
    const approve = useCallback(
        async (id) => {
            try {
                await dispatch(approveRoomRequirement(id)).unwrap();
                showSuccess("Đã phê duyệt yêu cầu phòng");
                refresh();
            } catch (err) {
                showError("Phê duyệt thất bại");
                console.error(err);
            }
        },
        [dispatch, refresh]
    );

    const reject = useCallback(
        async (id) => {
            try {
                await dispatch(rejectRoomRequirement(id)).unwrap();
                showSuccess("Đã từ chối yêu cầu phòng");
                refresh();
            } catch (err) {
                showError("Từ chối thất bại");
                console.error(err);
            }
        },
        [dispatch, refresh]
    );

    /* -------------------- SELECTED ITEM -------------------- */
    const setSelected = useCallback(
        (req) => {
            dispatch(setSelectedRequirement(req));
        },
        [dispatch]
    );

    const clearSelected = useCallback(() => {
        dispatch(clearSelectedRequirement());
    }, [dispatch]);

    /* -------------------- TRẢ VỀ -------------------- */
    return {
        requirements: items,
        loading,
        error,
        selected,
        meta,
        refresh,
        approve,
        reject,
        setSelected,
        clearSelected,
    };
}
