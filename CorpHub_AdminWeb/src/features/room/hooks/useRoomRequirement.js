import { useDispatch, useSelector } from "react-redux";
import {
    fetchRoomRequirements,
    approveRoomRequirement,
    rejectRoomRequirement,
    fetchRoomRequirementsFilter,
    fetchAllocationSuggestion,
    clearSuggestionFor,
} from "../store/roomRequirementSlice";
import { useCallback, useEffect, useState } from "react";
import { showSuccess, showError } from "../../../utils/toastUtils";
import { useSuitableRooms } from "./useSuitableRooms";

export const useRoomRequirements = () => {
    const dispatch = useDispatch();

    // ✅ Get new state with loadingSuitable
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

    const { loadSuitableRooms } = useSuitableRooms();


    const [page, setPage] = useState(0); // Backend page start = 0
    const [size] = useState(meta?.size || 9);
    const [status, setStatus] = useState(null); // all statuses
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        dispatch(fetchRoomRequirements({ page, size, status }));
    }, [dispatch, page, size, status]);

    /* -------------------- ACTIONS -------------------- */
    const approve = useCallback(
        async (id, roomId) => {
            try {
                const res = await dispatch(approveRoomRequirement({ id, roomId })).unwrap();
                if (res?.data === true)
                    showSuccess("Room requirement approved");
                else
                    showError("Approval failed");

                dispatch(fetchRoomRequirements({ page, size, status }));
            } catch (err) {
                showError("Approval failed");
                console.error(err);
            }
        },
        [dispatch, page, size, status]
    );

    const reject = useCallback(
        async (id) => {
            try {
                const res = await dispatch(rejectRoomRequirement(id)).unwrap();
                if (res?.data?.success === true)
                    showSuccess("Room requirement rejected");
                else
                    showError("Rejection failed");
                dispatch(fetchRoomRequirements({ page, size, status }));
            } catch (err) {
                showError("Rejection failed");
                console.error(err);
            }
        },
        [dispatch, page, size, status]
    );

    const suggest = useCallback(
        async (ids) => {
            try {
                const res = await dispatch(fetchAllocationSuggestion(ids)).unwrap();
            } catch (err) {
                showError("An error occurred");
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
    

    /* -------------------- LOAD ROOM REQUIREMENTS BY ROOM -------------------- */
    const loadRoomRequirements = useCallback(
        async (roomId, date) => {
            if (!roomId) return;
            await dispatch(fetchRoomRequirementsFilter({ roomId, date })).unwrap();
        },
        [dispatch]
    );


    /* -------------------- RETURN -------------------- */
    return {
        // data
        requirements: items,       // all requirements
        roomRequirements: roomReqsByRoom, // requirements by room
        suitableRooms,
        allocationSuggestion,
        page,
        size,
        selected,
        totalPages: meta?.totalPages || 0,
        meta,
        status,
        setStatus,
        loading,
        loadingSuitable,
        loadingRoomReqsByRoom,
        error,
        // actions
        loadRoomRequirements,   // ✅ replaces handleFetchRoomRequirements
        loadSuitableRooms,
        approve,
        reject,
        suggest,
        clearSuggestion,
        setSelected,
        setPage

    };

}
