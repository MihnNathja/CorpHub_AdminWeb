import { useDispatch, useSelector } from "react-redux";
import {
    fetchRoomRequirements,
    approveRoomRequirement,
    rejectRoomRequirement,
    setSelectedRequirement,
    clearSelectedRequirement,
    fetchSuitableRooms,
} from "../store/roomRequirementSlice";
import { useCallback, useEffect } from "react";
import { showSuccess, showError } from "../../../utils/toastUtils";

export function useRoomRequirement(autoFetch = true) {
    const dispatch = useDispatch();

    // ✅ Lấy state mới có thêm loadingSuitable
    const {
        items,
        suitableRooms,
        loading,
        loadingSuitable,
        error,
        selected,
        meta,
    } = useSelector((state) => state.roomRequirements);

    /* -------------------- LOAD DANH SÁCH -------------------- */
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
        async (id, roomId) => {
            try {
                const res = await dispatch(approveRoomRequirement({ id, roomId })).unwrap();
                console.log(res.data);
                if (res?.data === true)
                    showSuccess("Đã phê duyệt yêu cầu phòng");
                else
                    showError("Phê duyệt thất bại");
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
                const res = await dispatch(rejectRoomRequirement(id)).unwrap();
                if (res?.data?.success === true)
                    showSuccess("Đã từ chối yêu cầu phòng");
                else
                    showError("Từ chối thất bại");
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

    /* -------------------- LOAD PHÒNG PHÙ HỢP -------------------- */
    const loadSuitableRooms = useCallback(
        async (id) => {
            if (!id) return;
            try {
                await dispatch(fetchSuitableRooms(id)).unwrap();
            } catch (err) {
                console.error("❌ Lỗi khi tải danh sách phòng phù hợp:", err);
            }
        },
        [dispatch]
    );

    /* -------------------- TRẢ VỀ -------------------- */
    return {
        // dữ liệu
        requirements: items,
        suitableRooms,
        meta,
        // trạng thái
        loading,            // loading danh sách yêu cầu
        loadingSuitable,    // 🆕 loading phòng phù hợp (cho modal)
        error,
        selected,
        // hành động
        refresh,
        loadSuitableRooms,
        approve,
        reject,
        setSelected,
        clearSelected,
    };
}
