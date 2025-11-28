import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, useCallback } from "react";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { fetchTodayShiftsForUser } from "../store/scheduleSlice";
import { showError, showSuccess } from "../../../utils/toastUtils";

dayjs.extend(isoWeek);

export const useSchedule = () => {
    const dispatch = useDispatch();

    const { today, meta } = useSelector((state) => state.schedule.user);
    const { loading, error } = useSelector((state) => state.schedule);

    useEffect(() => {
        dispatch(
            fetchTodayShiftsForUser()
        );
    }, [dispatch]);

    return {
        schedules: today || [],
        meta,
        loading,
        error,
    };
};
