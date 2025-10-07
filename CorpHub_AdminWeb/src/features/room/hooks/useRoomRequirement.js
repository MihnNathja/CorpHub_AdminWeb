import { useDispatch, useSelector } from "react-redux";
import {
    fetchRoomRequirements,
    // approveRoomRequirement,
    // rejectRoomRequirement,
    setSelectedRequirement,
    clearSelectedRequirement,
} from "../store/roomRequirementSlice";
import { useCallback, useEffect } from "react";

export function useRoomRequirement(autoFetch = true) {
    const dispatch = useDispatch();

    const { list, loading, error, selected } = useSelector(
        (state) => state.roomRequirements
    );

    /* -------------------- LOAD DỮ LIỆU -------------------- */
    const refresh = useCallback(() => {
        dispatch(fetchRoomRequirements());
    }, [dispatch]);

    useEffect(() => {
        if (autoFetch) refresh();
    }, [autoFetch, refresh]);

    // /* -------------------- HÀNH ĐỘNG -------------------- */
    // const approve = useCallback(
    //     (id) => {
    //         dispatch(approveRoomRequirement(id));
    //     },
    //     [dispatch]
    // );

    // const reject = useCallback(
    //     (id) => {
    //         dispatch(rejectRoomRequirement(id));
    //     },
    //     [dispatch]
    // );

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
        requirements: list,
        loading,
        error,
        selected,
        refresh,
        // approve,
        // reject,
        setSelected,
        clearSelected,
    };
}
