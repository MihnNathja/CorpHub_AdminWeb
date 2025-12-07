import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useCallback } from "react";
import {
    fetchRooms,
    createOrUpdateRoom,
    removeRoom,
    setSelectedRoom,
    assignAssetsToRoom,
} from "../store/roomSlice";
import { set } from "date-fns";
import { removeFromRoom } from "../../asset/store/assetSlice";
import { showError, showSuccess } from "../../../utils/toastUtils";

export const useRooms = () => {
    const dispatch = useDispatch();

    // Redux state
    const { rooms, meta, loading, error, selectedRoom } = useSelector(
        (state) => state.rooms
    );

    // Local states
    const [page, setPage] = useState(0); // Backend page start = 0
    const [size] = useState(meta?.size || 9);
    const [keywords, setKeywords] = useState("");

    // Bộ lọc nâng cao
    const [filters, setFilters] = useState({
        typeId: "",
        departmentId: "",
        minCapacity: "",
        minArea: "",
        status: "",
    });

    // ✅ Hàm cập nhật bộ lọc
    const updateFilters = useCallback((newFilters) => {
        setFilters((prev) => ({ ...prev, ...newFilters }));
        setPage(0); // reset về page 0 khi đổi filter
    }, []);

    const clearFilters = () => {
        const cleared = {
            typeId: "",
            departmentId: "",
            minCapacity: "",
            minArea: "",
            status: "",
        };

        setKeywords("");
        setFilters(cleared);
        updateFilters(cleared);
        setPage(0);
    };

    // ✅ Fetch rooms mặc định (khi mount hoặc filter thay đổi)
    useEffect(() => {
        dispatch(fetchRooms({ page, size, ...filters, keywords }));
    }, [dispatch, page, size, filters, keywords]);

    // Tổng số trang (fallback nếu meta chưa có)
    const totalPages =
        meta?.totalPages || Math.ceil(rooms.length / size) || 1;

    // === HANDLERS ===
    const handleCreateOrUpdate = useCallback(
        async (roomData) => {
            await dispatch(createOrUpdateRoom(roomData));
            dispatch(fetchRooms({ page, size, ...filters, keywords }));
        },
        [dispatch, page, size, filters, keywords]
    );

    const handleRemove = useCallback(
        async (id) => {
            await dispatch(removeRoom(id));
            dispatch(fetchRooms({ page, size, ...filters, keywords }));
        },
        [dispatch, page, size, filters, keywords]
    );

    const setSelected = useCallback(
        (room) => {
            dispatch(setSelectedRoom(room));
        },
        [dispatch]
    );

    const handleAssignAssets = useCallback(
        async (data) => {
            await dispatch(assignAssetsToRoom(data));
            dispatch(fetchRooms({ page, size, ...filters, keywords }));
        },
        [dispatch, page, size, filters, keywords]
    );

    const handleRemoveAssetFromRoom = async (assetId) => {
        try {
            await dispatch(removeFromRoom(assetId)).unwrap();
            dispatch(fetchRooms({ page, size, ...filters, keywords }));
            showSuccess("Remove asset from room successfully");
        } catch (error) {
            console.error("Failed to remove asset from room:", error);
            showError("Failed to remove asset from room");
        }
        [dispatch, page, size, filters, keywords]
    };

    return {
        // Data
        rooms,
        loading,
        error,
        totalPages,
        meta,
        page,

        // States
        size,
        keywords,
        setKeywords,
        filters,
        updateFilters,
        clearFilters,
        setPage,

        // Selected room
        selectedRoom,
        setSelectedRoom: setSelected,

        // Handlers
        handleCreateOrUpdate,
        handleRemove,
        handleAssignAssets,
        handleRemoveAssetFromRoom
    };
};
