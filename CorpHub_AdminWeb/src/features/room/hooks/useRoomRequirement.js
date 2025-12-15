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


    const [page, setPage] = useState(0); // Backend page start = 0
    const [size] = useState(meta?.size || 9);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        dispatch(fetchRoomRequirements());
    }, [dispatch, page, size]);

    /* -------------------- ACTIONS -------------------- */
    const approve = useCallback(
        async (id, roomId) => {
            try {
                const res = await dispatch(approveRoomRequirement({ id, roomId })).unwrap();
                if (res?.data === true)
                    showSuccess("Room requirement approved");
                else
                    showError("Approval failed");

                dispatch(fetchRoomRequirements());
            } catch (err) {
                showError("Approval failed");
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
                    showSuccess("Room requirement rejected");
                else
                    showError("Rejection failed");
                dispatch(fetchRoomRequirements());
            } catch (err) {
                showError("Rejection failed");
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


    /* -------------------- LOAD SUITABLE ROOMS -------------------- */
    const loadSuitableRooms = useCallback(
        async (selected) => {
            if (!selected) return;
            try {
                await dispatch(fetchSuitableRooms(selected.id)).unwrap();
            } catch (err) {
                console.error("❌ Error loading suitable rooms:", err);
            }
        },
        [dispatch]
    );

    // ✅ Automatically load suitable rooms when selected changes
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
        // status
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
        setSelected

    };

}
