import { useDispatch, useSelector } from "react-redux";
import {
    fetchRoomRequirements,
    approveRoomRequirement,
    rejectRoomRequirement,
    fetchSuitableRooms,
    fetchRoomRequirementsFilter,
    fetchAllocationSuggestion,
    clearSuggestionFor,
} from "../store/roomRequirementSlice";
import { useCallback, useEffect, useState } from "react";
import { showSuccess, showError } from "../../../utils/toastUtils";

export const useRoomRequirements = () => {
    const dispatch = useDispatch();

    // ✅ Lấy state mới có thêm loadingSuitable
    const {
        items,
        suitableRooms,
        roomReqsByRoom,
        allocationSuggestion,
        loading,
        loadingSuitable,
        loadingRoomReqsByRoom,
        error,
        meta,
    } = useSelector((state) => state.roomRequirements);


    const [page, setPage] = useState(0); // Backend page start = 0
    const [size] = useState(meta?.size || 9);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        dispatch(fetchRoomRequirements());
    }, [dispatch, page, size]);

    /* -------------------- HÀNH ĐỘNG -------------------- */
    const approve = useCallback(
        async (id, roomId) => {
            try {
                const res = await dispatch(approveRoomRequirement({ id, roomId })).unwrap();
                if (res?.data === true)
                    showSuccess("Đã phê duyệt yêu cầu phòng");
                else
                    showError("Phê duyệt thất bại");

                dispatch(fetchRoomRequirements());
            } catch (err) {
                showError("Phê duyệt thất bại");
                console.error(err);
            }
        },
        [dispatch, page, size]
    );

    const reject = useCallback(
        async (id) => {
            try {
                const res = await dispatch(rejectRoomRequirement(id)).unwrap();
                if (res?.data?.success === true)
                    showSuccess("Đã từ chối yêu cầu phòng");
                else
                    showError("Từ chối thất bại");
                dispatch(fetchRoomRequirements());
            } catch (err) {
                showError("Từ chối thất bại");
                console.error(err);
            }
        },
        [dispatch, page, size]
    );

    const suggest = useCallback(
        async (ids) => {
            try {
                const res = await dispatch(fetchAllocationSuggestion(ids)).unwrap();
            } catch (err) {
                showError("Có lỗi xảy ra");
                console.error(err);
            }
        },
        [dispatch, page, size]
    )

    const clearSuggestion = useCallback(
        (id) => {
            dispatch(clearSuggestionFor(id));
        },
        [dispatch]
    );


    /* -------------------- LOAD PHÒNG PHÙ HỢP -------------------- */
    const loadSuitableRooms = useCallback(
        async (selected) => {
            if (!selected) return;
            try {
                await dispatch(fetchSuitableRooms(selected.id)).unwrap();
            } catch (err) {
                console.error("❌ Lỗi khi tải danh sách phòng phù hợp:", err);
            }
        },
        [dispatch]
    );

    // ✅ Tự động load phòng phù hợp khi selected thay đổi
    useEffect(() => {
        if (selected) {
            loadSuitableRooms(selected);
        }
    }, [selected, loadSuitableRooms]);


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
        allocationSuggestion,
        page,
        size,
        selected,
        // trạng thái
        loading,
        loadingSuitable,
        loadingRoomReqsByRoom,
        error,
        // hành động
        loadRoomRequirements,   // ✅ thay thế handleFetchRoomRequirements
        loadSuitableRooms,
        approve,
        reject,
        suggest,
        clearSuggestion,
        setSelected

    };

}
