import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useMemo } from "react";
import {
    fetchRooms,
    createOrUpdateRoom,
    removeRoom,
    setSelectedRoom,
} from "../store/roomSlice";

export const useRooms = () => {
    const dispatch = useDispatch();
    const { rooms, loading, error, selectedRoom } = useSelector(
        (state) => state.rooms
    );

    // local state
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState("ALL");
    const pageSize = 9;

    // fetch data khi mount
    useEffect(() => {
        dispatch(fetchRooms());
    }, [dispatch]);

    // Đếm số lượng theo trạng thái
    const statusCounts = useMemo(() => {
        return rooms.reduce((acc, r) => {
            const key = r.status?.toUpperCase() || "UNKNOWN";
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});
    }, [rooms]);

    // Lọc theo trạng thái
    const filteredRooms = useMemo(() => {
        if (statusFilter === "ALL") return rooms;
        return rooms.filter((r) => r.status?.toUpperCase() === statusFilter);
    }, [rooms, statusFilter]);

    // Phân trang trên filteredRooms
    const totalPages = Math.ceil(filteredRooms.length / pageSize) || 1;
    const paginatedRooms = useMemo(() => {
        const start = (page - 1) * pageSize;
        return filteredRooms.slice(start, start + pageSize);
    }, [filteredRooms, page]);

    // handlers
    const handleCreateOrUpdate = async (roomData) => {
        await dispatch(createOrUpdateRoom(roomData));
        dispatch(fetchRooms());
    };

    const handleRemove = async (id) => {
        await dispatch(removeRoom(id));
        dispatch(fetchRooms());
    };

    const setSelected = (room) => {
        dispatch(setSelectedRoom(room));
    };

    return {
        rooms,
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
