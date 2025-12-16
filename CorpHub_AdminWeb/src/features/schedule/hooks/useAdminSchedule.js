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
import { exportWorkSchedules } from "../services/scheduleApi";
import { showError, showSuccess } from "../../../utils/toastUtils";

dayjs.extend(isoWeek);

export const useAdminSchedule = () => {
  const dispatch = useDispatch();

  const { items, meta } = useSelector((state) => state.schedule.admin);
  const { loading, error } = useSelector((state) => state.schedule);

  // ✅ Default date range: current week
  const today = dayjs();
  const defaultFrom = today.startOf("week").add(1, "day").format("YYYY-MM-DD"); // Monday
  const defaultTo = today.endOf("week").add(1, "day").format("YYYY-MM-DD"); // Sunday

  // Pagination
  const [page, setPage] = useState(meta.page ?? 0);
  const [size, setSize] = useState(meta.size ?? 10);

  // ✅ Use ISO date string, not Date.now()
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
          showSuccess("Auto-assign schedules successfully!");
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
          showError(res.payload?.message || "Cannot assign schedules!");
        }
        return res;
      } catch (err) {
        console.error(err);
        showError("Error assigning schedules!");
      }
    },
    [dispatch, page, size, from, to, filters]
  );

  const addSchedule = useCallback(
    async (data) => {
      try {
        const res = await dispatch(createSchedule(data));
        if (res.meta.requestStatus === "fulfilled") {
          showSuccess("Work schedule added successfully!");
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
          showError(res.payload?.message || "Cannot add work schedule!");
        }
        return res;
      } catch (err) {
        console.error(err);
        showError("Error adding work schedule!");
      }
    },
    [dispatch, page, size, from, to, filters]
  );

  const editSchedule = useCallback(
    async (id, data) => {
      try {
        const res = await dispatch(updateSchedule({ id, data }));
        if (res.meta.requestStatus === "fulfilled") {
          showSuccess("Work schedule updated successfully!");
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
          showError(
            res.payload?.message || "Cannot update work schedule!"
          );
        }
        return res;
      } catch (err) {
        console.error(err);
        showError("Error updating work schedule!");
      }
    },
    [dispatch, page, size, from, to, filters]
  );
  const removeSchedule = useCallback(
    async (id) => {
      try {
        const res = await dispatch(deleteSchedule(id));
        if (res.meta.requestStatus === "fulfilled") {
          showSuccess("Work schedule deleted successfully!");
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
          showError(res.payload?.message || "Cannot delete work schedule!");
        }
        return res;
      } catch (err) {
        console.error(err);
        showError("Error deleting work schedule!");
      }
    },
    [dispatch, page, size, from, to, filters]
  );

  const exportWorkSchedule = useCallback(
    async (payload = {}, onProgress) => {
      const body = {
        fromDate: from,
        toDate: to,
        departmentId: filters.departmentId || null,
        employeeIds: [],
        format: "EXCEL",
        layout: "CALENDAR",
        includeShiftSheet: true,
        includeRawDataSheet: false,
        ...payload,
      };

      try {
        const res = await exportWorkSchedules(body, {
          onDownloadProgress: (evt) => {
            if (!onProgress) return;
            const total = evt?.total || 0;
            if (!total) {
              onProgress(50);
              return;
            }
            const percent = Math.min(
              100,
              Math.round((evt.loaded / total) * 100)
            );
            onProgress(percent);
          },
        });

        const disposition = res.headers?.["content-disposition"] || "";
        const match = disposition.match(/filename="?([^";]+)"?/i);
        const fallbackName = body.fileName || "work-schedules.xlsx";
        const fileName = match?.[1] || fallbackName;

        const blob = new Blob([res.data], {
          type:
            res.headers?.["content-type"] ||
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        showSuccess("Started downloading work schedule file.");
        return { success: true };
      } catch (err) {
        const message =
          err?.data?.message || err?.message || "Export file failed";
        showError(message);
        return { success: false, error: message };
      }
    },
    [from, to, filters]
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
    exportWorkSchedule,
  };
};
