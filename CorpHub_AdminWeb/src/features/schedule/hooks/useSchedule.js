import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { fetchSchedules } from "../store/scheduleSlice";

dayjs.extend(isoWeek);

export const useSchedule = () => {
    const dispatch = useDispatch();

    const { items, meta = {}, loading, error } = useSelector(
        (state) => state.schedule
    );

    // ✅ Default date range: tuần hiện tại
    const today = dayjs();
    const defaultFrom = today.startOf("week").add(1, "day").format("YYYY-MM-DD"); // Monday
    const defaultTo = today.endOf("week").add(1, "day").format("YYYY-MM-DD");     // Sunday

    // Pagination
    const [page, setPage] = useState(meta.page ?? 0);
    const [size, setSize] = useState(meta.size ?? 10);

    // ✅ Use ISO date string, không dùng Date.now()
    const [from, setFrom] = useState(meta.from ?? defaultFrom);
    const [to, setTo] = useState(meta.to ?? defaultTo);

    // Filters
    const [filters, setFilters] = useState({
        keywords: "",
    });

    /**
     * ✅ Fetch API khi thay đổi filter hoặc phân trang
     */
    useEffect(() => {
        dispatch(
            fetchSchedules({
                page,
                size,
                from,
                to,
                ...filters,
            })
        );
    }, [dispatch, page, size, from, to, filters]);


    return {
        schedules: items || [],
        meta,
        loading,
        error,
        page,
        setPage,
        size,
        setSize,

        from,
        setFrom,
        to,
        setTo,

        filters,
        setFilters,
    };
};
