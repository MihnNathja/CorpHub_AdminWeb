import { useDispatch, useSelector } from "react-redux";
import {
    fetchRoomRequirements,
    approveRoomRequirement,
    rejectRoomRequirement,
    setSelectedRequirement,
    clearSelectedRequirement,
    fetchSuitableRooms,
    fetchRoomRequirementsFilter,
} from "../store/roomRequirementSlice";
import { useCallback, useEffect } from "react";
import { showSuccess, showError } from "../../../utils/toastUtils";

export function useRoomRequirement(autoFetch = true) {
    const dispatch = useDispatch();

    // ✅ Lấy state mới có thêm loadingSuitable
    const {
        items,
        suitableRooms,
        roomReqsByRoom,
        loading,
        loadingSuitable,
        loadingRoomReqsByRoom,
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

    /* -------------------- LOAD ROOM REQUIREMENTS BY ROOM -------------------- */
    const loadRoomRequirements = useCallback(
        async (roomId, date) => {
            if (!roomId) return;
            await dispatch(fetchRoomRequirementsFilter({ roomId, date })).unwrap();
        },
        [dispatch]
    );


    /* -------------------- TRẢ VỀ -------------------- */
    return {
        // dữ liệu
        requirements: items,       // tất cả yêu cầu
        roomRequirements: roomReqsByRoom, // yêu cầu theo phòng
        suitableRooms,
        meta,
        // trạng thái
        loading,
        loadingSuitable,
        loadingRoomReqsByRoom,
        error,
        // hành động
        refresh,
        loadRoomRequirements,   // ✅ thay thế handleFetchRoomRequirements
        loadSuitableRooms,
        approve,
        reject,
        setSelected,
        clearSelected,
    };

}
