import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useMemo, useCallback } from "react";
import {
    fetchRooms,
    createOrUpdateRoom,
    removeRoom,
    setSelectedRoom,
} from "../store/roomSlice";

export const useRooms = () => {
    const dispatch = useDispatch();

    // Lấy dữ liệu từ Redux store
    const { items, meta, loading, error, selectedRoom } = useSelector(
        (state) => state.rooms
    );

    // Local state cho phân trang và filter
    const [page, setPage] = useState(0); // Page trong backend bắt đầu từ 0
    const [statusFilter, setStatusFilter] = useState("ALL");
    const size = meta?.size || 9;

    // Fetch khi mount hoặc đổi trang
    useEffect(() => {
        dispatch(fetchRooms({ page, size }));
    }, [dispatch, page, size]);

    // Đếm số lượng theo trạng thái (an toàn)
    const statusCounts = useMemo(() => {
        if (!Array.isArray(items)) return {};
        return items.reduce((acc, room) => {
            const key = room.status?.toUpperCase() || "UNKNOWN";
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});
    }, [items]);

    // Lọc theo trạng thái (client-side)
    const filteredRooms = useMemo(() => {
        if (!Array.isArray(items)) return [];
        if (statusFilter === "ALL") return items;
        return items.filter(
            (r) => r.status?.toUpperCase() === statusFilter
        );
    }, [items, statusFilter]);

    // Phân trang (nếu backend chưa có meta)
    const totalPages =
        meta?.totalPages ||
        Math.ceil(filteredRooms.length / size) ||
        1;

    const paginatedRooms = useMemo(() => {
        if (meta?.totalPages) return filteredRooms; // backend đã phân trang
        const start = page * size;
        return filteredRooms.slice(start, start + size);
    }, [filteredRooms, meta, page, size]);

    // === HANDLERS ===
    const handleCreateOrUpdate = useCallback(
        async (roomData) => {
            await dispatch(createOrUpdateRoom(roomData));
            dispatch(fetchRooms({ page, size }));
        },
        [dispatch, page, size]
    );

    const handleRemove = useCallback(
        async (id) => {
            await dispatch(removeRoom(id));
            dispatch(fetchRooms({ page, size }));
        },
        [dispatch, page, size]
    );

    const setSelected = useCallback(
        (room) => {
            dispatch(setSelectedRoom(room));
        },
        [dispatch]
    );

    return {
        rooms: items,
        loading,
        error,
        page,
        totalPages,
        setPage,
        statusFilter,
        setStatusFilter,
        statusCounts,
        filteredRooms,
        paginatedRooms,
        selectedRoom,
        setSelectedRoom: setSelected,
        handleCreateOrUpdate,
        handleRemove,
    };
};
