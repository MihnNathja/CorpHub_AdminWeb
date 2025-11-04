import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRoomTypes } from "../store/roomTypeSlice";

export const useRoomTypes = () => {
    const dispatch = useDispatch();

    const {
        items: roomTypes,
        loading,
        error,
    } = useSelector((state) => state.roomTypes);
    const refresh = useCallback(() => {
        dispatch(fetchRoomTypes());
    }, [dispatch]);

    useEffect(() => {
        if (!roomTypes || roomTypes.length === 0) {
            dispatch(fetchRoomTypes());
        }
    }, [dispatch]);

    return {
        roomTypes,
        loading,
        error,
        refresh,
    };
};
