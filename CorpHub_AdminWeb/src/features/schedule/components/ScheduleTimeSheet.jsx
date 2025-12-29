import React, { useState, useMemo, useEffect } from "react";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import weekday from "dayjs/plugin/weekday";
import localizedFormat from "dayjs/plugin/localizedFormat";

import "dayjs/locale/vi";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  PlusIcon,
  CheckCircleIcon,
  DocumentArrowDownIcon,
  CalendarIcon,
  UserGroupIcon,
  XMarkIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

import { useAdminSchedule } from "../hooks/useAdminSchedule";
import AutoAssignModal from "./AutoAssignModal";
import WorkScheduleModal from "./WorkScheduleModal";
import ExportScheduleModal from "./ExportScheduleModal";
import { useShift } from "../hooks/useShift";
import { useUser } from "../../user/hooks/useUser";
import ShiftCard from "./ShiftCard";

dayjs.extend(isoWeek);
dayjs.extend(weekday);
dayjs.extend(localizedFormat);
dayjs.locale("en"); // Changed from "vi"

const sameDay = (dateStr, d) => dayjs(dateStr).isSame(d, "day");

const getDatesInRange = (from, to) => {
  const dates = [];
  let cur = dayjs(from);
  const end = dayjs(to);

  while (cur.isBefore(end) || cur.isSame(end, "day")) {
    dates.push(cur);
    cur = cur.add(1, "day");
  }
  return dates;
};

export default function ScheduleTimesheet({ departments = [] }) {
  const [view, setView] = useState("week");
  const [anchor, setAnchor] = useState(dayjs());
  const [showAutoAssign, setShowAutoAssign] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const {
    schedules,
    from,
    to,
    setFrom,
    setTo,
    loading,
    autoAssign,
    addSchedule,
    editSchedule,
    removeSchedule,
    filters,
    setFilters,
    exportWorkSchedule,
  } = useAdminSchedule();

  const {
    shifts,
    filters: shiftFilters,
    setFilters: setShiftFilters,
  } = useShift([]);
  const { list: users, keyword, setKeyword } = useUser();

  // ✅ KHỞI TẠO from/to khi component mount
  useEffect(() => {
    const today = dayjs();
    const weekStart = today.startOf("week").format("YYYY-MM-DD");
    const weekEnd = today.endOf("week").format("YYYY-MM-DD");

    setFrom(weekStart);
    setTo(weekEnd);
    setAnchor(today);
  }, []);

  // ✅ Ngày hiển thị theo from/to
  const days = useMemo(() => {
    if (!from || !to) return [];
    return getDatesInRange(from, to);
  }, [from, to]);

  // ✅ Prev
  const prev = () => {
    let newAnchor;

    if (view === "week") newAnchor = anchor.subtract(1, "week");
    else newAnchor = anchor.subtract(1, "month");

    setAnchor(newAnchor);

    if (view === "week") {
      setFrom(newAnchor.startOf("week").format("YYYY-MM-DD"));
      setTo(newAnchor.endOf("week").format("YYYY-MM-DD"));
    } else {
      setFrom(newAnchor.startOf("month").format("YYYY-MM-DD"));
      setTo(newAnchor.endOf("month").format("YYYY-MM-DD"));
    }
  };

  // ✅ Next
  const next = () => {
    let newAnchor;

    if (view === "week") newAnchor = anchor.add(1, "week");
    else newAnchor = anchor.add(1, "month");

    setAnchor(newAnchor);

    if (view === "week") {
      setFrom(newAnchor.startOf("week").format("YYYY-MM-DD"));
      setTo(newAnchor.endOf("week").format("YYYY-MM-DD"));
    } else {
      setFrom(newAnchor.startOf("month").format("YYYY-MM-DD"));
      setTo(newAnchor.endOf("month").format("YYYY-MM-DD"));
    }
  };

  // ✅ Khi chuyển sang view Tháng
  const switchToMonth = () => {
    setView("month");
    const m = anchor;
    setFrom(m.startOf("month").format("YYYY-MM-DD"));
    setTo(m.endOf("month").format("YYYY-MM-DD"));
  };

  // ✅ Khi chuyển sang view Tuần
  const switchToWeek = () => {
    setView("week");
    const m = anchor;
    setFrom(m.startOf("week").format("YYYY-MM-DD"));
    setTo(m.endOf("week").format("YYYY-MM-DD"));
  };

  const periodLabel =
    view === "week"
      ? `${dayjs(from).format("DD/MM")} – ${dayjs(to).format("DD/MM/YYYY")}`
      : dayjs(from).format("MMMM YYYY");

  const isToday = (date) => dayjs(date).isSame(dayjs(), "day");

  // ✅ Handle filter changes
  const handleKeywordsChange = (e) => {
    setFilters({ ...filters, keywords: e.target.value });
  };

  const handleDepartmentChange = (e) => {
    setFilters({ ...filters, departmentId: e.target.value });
  };

  const handleClearFilters = () => {
    setFilters({ keywords: "", departmentId: "" });
    setShowFilters(false);
  };

  const hasActiveFilters = filters.keywords || filters.departmentId;

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      {/* MODERN HEADER */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 px-6 py-5 border-b border-blue-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <CalendarIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                Schedule & Timesheet
              </h2>
              <p className="text-blue-100 text-sm flex items-center gap-2 mt-1">
                <UserGroupIcon className="w-4 h-4" />
                <span>{schedules.length} employees</span>
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowExport(true)}
              className="px-4 py-2.5 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-xl transition-all flex items-center gap-2 border border-white/20 font-medium"
            >
              <DocumentArrowDownIcon className="w-5 h-5" />
              <span>Export</span>
            </button>
            <button
              onClick={() => setShowAutoAssign(true)}
              className="px-4 py-2.5 bg-white hover:bg-gray-50 text-blue-600 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Assign shifts</span>
            </button>
          </div>
        </div>
      </div>

      {/* CONTROL BAR */}
      <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          {/* Navigation */}
          <div className="flex items-center gap-3">
            <button
              onClick={prev}
              className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>

            <div className="px-5 py-2.5 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 min-w-[200px] text-center">
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {periodLabel}
              </span>
            </div>

            <button
              onClick={next}
              className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowRightIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>

          {/* View Switch & Filter */}
          <div className="flex items-center gap-3">
            <div className="flex bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-300 dark:border-gray-600">
              <button
                onClick={switchToWeek}
                className={`px-6 py-2 text-sm font-medium rounded-md transition-all ${view === "week"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
              >
                Week
              </button>

              <button
                onClick={switchToMonth}
                className={`px-6 py-2 text-sm font-medium rounded-md transition-all ${view === "month"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
              >
                Month
              </button>
            </div>

            {/* Filter Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`relative px-4 py-2.5 rounded-lg border-2 transition-all flex items-center gap-2 font-medium ${hasActiveFilters
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                  : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500"
                }`}
            >
              <FunnelIcon className="w-5 h-5" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="absolute top-0 right-0 w-3 h-3 bg-blue-500 rounded-full transform translate-x-1 -translate-y-1"></span>
              )}
            </motion.button>
          </div>
        </div>

        {/* FILTER PANEL */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700"
          >
            {/* Keywords Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Search employee
              </label>
              <input
                type="text"
                placeholder="Enter name or employee ID..."
                value={filters.keywords}
                onChange={handleKeywordsChange}
                className="w-full px-3 py-2.5 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all"
              />
            </div>

            {/* Department Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Department
              </label>
              <select
                value={filters.departmentId}
                onChange={handleDepartmentChange}
                className="w-full px-3 py-2.5 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all cursor-pointer"
              >
                <option value="">-- All departments --</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters Button */}
            <div className="flex items-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleClearFilters}
                className={`w-full px-4 py-2.5 rounded-lg border-2 font-medium transition-all flex items-center justify-center gap-2 ${hasActiveFilters
                    ? "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30"
                    : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 cursor-not-allowed opacity-50"
                  }`}
                disabled={!hasActiveFilters}
              >
                <XMarkIcon className="w-4 h-4" />
                <span>Clear filters</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>

      {/* LEGEND */}
      <div className="px-6 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-5 items-center flex-wrap text-xs">
          {[
            {
              color: "blue",
              bg: "bg-blue-100",
              border: "border-blue-400",
              text: "text-blue-700",
              label: "Scheduled",
            },
            {
              color: "indigo",
              bg: "bg-indigo-100",
              border: "border-indigo-400",
              text: "text-indigo-700",
              label: "In progress",
            },
            {
              color: "green",
              bg: "bg-green-100",
              border: "border-green-400",
              text: "text-green-700",
              label: "Completed",
            },
            {
              color: "red",
              bg: "bg-red-100",
              border: "border-red-400",
              text: "text-red-700",
              label: "Missed",
            },
            {
              color: "gray",
              bg: "bg-gray-100",
              border: "border-gray-400",
              text: "text-gray-700",
              label: "Cancelled",
            },
            {
              color: "amber",
              bg: "bg-amber-100",
              border: "border-amber-400",
              text: "text-amber-700",
              label: "Absence",
            },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded ${item.bg} border ${item.border}`}
              ></div>
              <span className={`font-medium ${item.text} dark:text-gray-300`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* GRID CONTAINER */}
      <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900/50">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-gray-500 dark:text-gray-400">Loading...</p>
            </div>
          </div>
        ) : schedules.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <UserGroupIcon className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">
                No data available
              </p>
              {hasActiveFilters && (
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                  Try changing the filters
                </p>
              )}
            </div>
          </div>
        ) : (
          <div
            className="grid min-w-max"
            style={{
              gridTemplateColumns: `60px 240px repeat(${days.length}, 160px)`,
            }}
          >
            {/* HEADER ROW */}
            <div className="sticky top-0 left-0 z-50 bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 border-b-2 border-gray-300 dark:border-gray-600 px-3 py-3 font-semibold text-gray-700 dark:text-gray-200 text-center">
              #
            </div>

            <div className="sticky top-0 left-[60px] z-50 bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 border-b-2 border-gray-300 dark:border-gray-600 border-l border-gray-300 dark:border-gray-600 px-4 py-3 font-semibold text-gray-700 dark:text-gray-200">
              Employee
            </div>

            {days.map((d) => {
              const today = isToday(d);
              return (
                <div
                  key={d.toString()}
                  className={`sticky top-0 z-40 border-b-2 border-l border-gray-300 dark:border-gray-600 px-3 py-3 text-center ${today
                      ? "bg-blue-600 text-white font-bold"
                      : "bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 text-gray-700 dark:text-gray-200"
                    }`}
                >
                  <div
                    className={`text-xs uppercase ${today
                        ? "text-blue-100"
                        : "text-gray-500 dark:text-gray-400"
                      }`}
                  >
                    {d.format("dd")}
                  </div>
                  <div className="text-base font-semibold mt-1">
                    {d.format("DD/MM")}
                  </div>
                </div>
              );
            })}

            {/* BODY ROWS */}
            {schedules.map((emp, i) => (
              <React.Fragment key={emp.id}>
                {/* Col # */}
                <div className="sticky left-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-3 py-4 text-center font-medium text-gray-600 dark:text-gray-300">
                  {i + 1}
                </div>

                {/* Col Employee */}
                <div className="sticky left-[60px] z-40 bg-white dark:bg-gray-800 border-b border-l border-gray-200 dark:border-gray-700 px-4 py-4">
                  <div className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {emp.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span>{emp.department}</span>
                  </div>
                </div>

                {/* Col Date */}
                {days.map((d) => {
                  const shifts = emp.shifts?.filter((s) =>
                    sameDay(s.workDate, d)
                  );
                  const today = isToday(d);

                  return (
                    <div
                      key={d.toString()}
                      className={`border-b border-l border-gray-200 dark:border-gray-700 p-2 ${today
                          ? "bg-blue-50/50 dark:bg-blue-900/10"
                          : "bg-white dark:bg-gray-800"
                        }`}
                    >
                      {!shifts || shifts.length === 0 ? (
                        <button
                          className="w-full h-full min-h-[60px] border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-400 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition-all group"
                          onClick={() => {
                            setEditingSchedule({
                              userId: emp.id,
                              fullName: emp.name,
                              shiftId: "",
                              shiftName: "",
                              workDate: d.format("YYYY-MM-DD"),
                              status: "SCHEDULED",
                            });
                            setShowModal(true);
                          }}
                        >
                          <PlusIcon className="w-5 h-5 mx-auto group-hover:scale-110 transition-transform" />
                        </button>
                      ) : (
                        <div className="flex flex-col gap-2">
                          {shifts.map((s) => (
                            <button
                              key={s.id}
                              onClick={() => {
                                setEditingSchedule({
                                  id: s.id,
                                  userId: emp.id,
                                  fullName: emp.name,
                                  shiftId: s.shiftId,
                                  shiftName: s.name,
                                  workDate: s.workDate,
                                  status: s.status,
                                });
                                setShowModal(true);
                              }}
                              className="w-full text-left"
                            >
                              <ShiftCard
                                shift={{
                                  title: s.shiftName,
                                  start: dayjs(`${s.workDate}T${s.startTime}`),
                                  end: dayjs(`${s.workDate}T${s.endTime}`),
                                  notes: s.notes,
                                  status: s.status,
                                  checkInTime: s.checkInTime,
                                  checkOutTime: s.checkOutTime,
                                }}
                                onDelete={() => removeSchedule(s.id)}
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {showAutoAssign && (
        <AutoAssignModal
          onClose={() => setShowAutoAssign(false)}
          departments={departments}
          shifts={shifts}
          shiftFilters={shiftFilters}
          setShiftFilters={setShiftFilters}
          users={users}
          userKeyword={keyword}
          setUserKeyword={setKeyword}
          autoAssign={autoAssign}
        />
      )}

      {showModal && (
        <WorkScheduleModal
          schedule={editingSchedule}
          shifts={shifts}
          users={users}
          userKeyword={keyword}
          setUserKeyword={setKeyword}
          onClose={() => {
            setShowModal(false);
            setEditingSchedule(null);
          }}
          onSubmit={async (form) => {
            if (form.id) {
              await editSchedule(form.id, form);
            } else {
              await addSchedule(form);
            }
            setShowModal(false);
            setEditingSchedule(null);
          }}
          onDelete={async (id) => {
            await removeSchedule(id);
            setShowModal(false);
            setEditingSchedule(null);
          }}
        />
      )}

      {showExport && (
        <ExportScheduleModal
          defaultFrom={from}
          defaultTo={to}
          departments={departments}
          users={users}
          userKeyword={keyword}
          setUserKeyword={setKeyword}
          onClose={() => setShowExport(false)}
          onExport={exportWorkSchedule}
        />
      )}
    </div>
  );
}
