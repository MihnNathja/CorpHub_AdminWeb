import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, useCallback } from "react";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import {
    autoAssignSchedules,
    fetchSchedules,
    createSchedule,
    updateSchedule,
    deleteSchedule,
} from "../store/scheduleSlice";
import { showError, showSuccess } from "../../../utils/toastUtils";

dayjs.extend(isoWeek);

export const useAdminSchedule = () => {
    const dispatch = useDispatch();

    const { items, meta } = useSelector((state) => state.schedule.admin);
    const { loading, error } = useSelector((state) => state.schedule);

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
        departmentId: "",
    });

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

    const autoAssign = useCallback(
        async (data) => {
            try {
                const res = await dispatch(autoAssignSchedules(data));
                if (res.meta.requestStatus === "fulfilled") {
                    showSuccess("Phân ca tự động thành công!");
                    dispatch(
                        fetchSchedules({
                            page,
                            size,
                            from,
                            to,
                            ...filters,
                        })
                    );
                } else {
                    showError(res.payload?.message || "Không thể phân ca!");
                }
                return res;
            } catch (err) {
                console.error(err);
                showError("Lỗi khi phân ca!");
            }
        },
        [dispatch, page, size, from, to, filters]
    );

    const addSchedule = useCallback(
        async (data) => {
            try {
                const res = await dispatch(createSchedule(data));
                if (res.meta.requestStatus === "fulfilled") {
                    showSuccess("Thêm lịch làm việc thành công!");
                    dispatch(
                        fetchSchedules({
                            page,
                            size,
                            from,
                            to,
                            ...filters,
                        })
                    );
                } else {
                    showError(res.payload?.message || "Không thể thêm lịch làm việc!");
                }
                return res;
            } catch (err) {
                console.error(err);
                showError("Lỗi khi thêm lịch làm việc!");
            }
        },
        [dispatch, page, size, from, to, filters]
    );

    const editSchedule = useCallback(
        async (id, data) => {
            try {
                const res = await dispatch(updateSchedule({ id, data }));
                if (res.meta.requestStatus === "fulfilled") {
                    showSuccess("Cập nhật lịch làm việc thành công!");
                    dispatch(
                        fetchSchedules({
                            page,
                            size,
                            from,
                            to,
                            ...filters,
                        })
                    );
                } else {
                    showError(res.payload?.message || "Không thể cập nhật lịch làm việc!");
                }
                return res;
            } catch (err) {
                console.error(err);
                showError("Lỗi khi cập nhật lịch làm việc!");
            }
        },
        [dispatch, page, size, from, to, filters]
    );
    const removeSchedule = useCallback(
        async (id) => {
            try {
                const res = await dispatch(deleteSchedule(id));
                if (res.meta.requestStatus === "fulfilled") {
                    showSuccess("Xóa lịch làm việc thành công!");
                    dispatch(
                        fetchSchedules({
                            page,
                            size,
                            from,
                            to,
                            ...filters,
                        })
                    );
                } else {
                    showError(res.payload?.message || "Không thể xóa lịch làm việc!");
                }
                return res;
            } catch (err) {
                console.error(err);
                showError("Lỗi khi xóa lịch làm việc!");
            }
        },
        [dispatch, page, size, from, to, filters]
    );

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

        autoAssign,
        addSchedule,
        editSchedule,
        removeSchedule,
    };
};
