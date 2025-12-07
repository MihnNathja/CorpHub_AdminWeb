import React, { useState, useMemo } from "react";
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
} from "@heroicons/react/24/outline";

import { useAdminSchedule } from "../hooks/useAdminSchedule";
import AutoAssignModal from "./AutoAssignModal";
import WorkScheduleModal from "./WorkScheduleModal";
import { useShift } from "../hooks/useShift";
import { useUser } from "../../user/hooks/useUser";
import ShiftCard from "./ShiftCard";

dayjs.extend(isoWeek);
dayjs.extend(weekday);
dayjs.extend(localizedFormat);
dayjs.locale("vi");

// Utilities
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

export default function ScheduleTimesheet({
    departments = [],
}) {
    const [view, setView] = useState("week");
    const [anchor, setAnchor] = useState(dayjs());
    const [showAutoAssign, setShowAutoAssign] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState(null);

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
        removeSchedule
    } = useAdminSchedule();

    const { shifts, filters, setFilters } = useShift([]);
    const { list: users, keyword, setKeyword } = useUser();

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
            setFrom(newAnchor.startOf("week").add(1, "day").format("YYYY-MM-DD"));
            setTo(newAnchor.endOf("week").add(1, "day").format("YYYY-MM-DD"));
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
            setFrom(newAnchor.startOf("week").add(1, "day").format("YYYY-MM-DD"));
            setTo(newAnchor.endOf("week").add(1, "day").format("YYYY-MM-DD"));
        } else {
            setFrom(newAnchor.startOf("month").format("YYYY-MM-DD"));
            setTo(newAnchor.endOf("month").format("YYYY-MM-DD"));
        }
    };

    // ✅ Khi chuyển sang view Tháng → set from/to về tháng đó
    const switchToMonth = () => {
        setView("month");

        const m = anchor;
        setFrom(m.startOf("month").format("YYYY-MM-DD"));
        setTo(m.endOf("month").format("YYYY-MM-DD"));
    };

    // ✅ Khi chuyển sang view Tuần → set from/to về tuần hiện tại
    const switchToWeek = () => {
        setView("week");

        const m = anchor;
        setFrom(m.startOf("week").add(1, "day").format("YYYY-MM-DD"));
        setTo(m.endOf("week").add(1, "day").format("YYYY-MM-DD"));
    };

    const periodLabel =
        view === "week"
            ? `${dayjs(from).format("DD/MM")} – ${dayjs(to).format("DD/MM/YYYY")}`
            : dayjs(from).format("MMMM YYYY");

    const isToday = (date) => dayjs(date).isSame(dayjs(), "day");

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
                            <h2 className="text-xl font-bold text-white">Schedule & Timesheet</h2>
                            <p className="text-blue-100 text-sm flex items-center gap-2 mt-1">
                                <UserGroupIcon className="w-4 h-4" />
                                <span>{schedules.length} nhân viên</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button className="px-4 py-2.5 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-xl transition-all flex items-center gap-2 border border-white/20 font-medium">
                            <DocumentArrowDownIcon className="w-5 h-5" />
                            <span>Export</span>
                        </button>
                        <button
                            onClick={() => setShowAutoAssign(true)}
                            className="px-4 py-2.5 bg-white hover:bg-gray-50 text-blue-600 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
                        >
                            <PlusIcon className="w-5 h-5" />
                            <span>Phân ca tự động</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* CONTROL BAR */}
            <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">

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

                    {/* View Switch */}
                    <div className="flex bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-300 dark:border-gray-600">
                        <button
                            onClick={switchToWeek}
                            className={`px-6 py-2 text-sm font-medium rounded-md transition-all ${view === "week"
                                    ? "bg-blue-600 text-white shadow-sm"
                                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                }`}
                        >
                            Tuần
                        </button>

                        <button
                            onClick={switchToMonth}
                            className={`px-6 py-2 text-sm font-medium rounded-md transition-all ${view === "month"
                                    ? "bg-blue-600 text-white shadow-sm"
                                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                }`}
                        >
                            Tháng
                        </button>
                    </div>
                </div>
            </div>

            {/* LEGEND */}
            <div className="px-6 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="flex gap-5 items-center flex-wrap text-xs">
                    {[
                    {color: "blue", bg: "bg-blue-100", border: "border-blue-400", text: "text-blue-700", label: "Scheduled" },
                    {color: "indigo", bg: "bg-indigo-100", border: "border-indigo-400", text: "text-indigo-700", label: "In progress" },
                    {color: "green", bg: "bg-green-100", border: "border-green-400", text: "text-green-700", label: "Completed" },
                    {color: "red", bg: "bg-red-100", border: "border-red-400", text: "text-red-700", label: "Missed" },
                    {color: "gray", bg: "bg-gray-100", border: "border-gray-400", text: "text-gray-700", label: "Cancelled" },
                    {color: "amber", bg: "bg-amber-100", border: "border-amber-400", text: "text-amber-700", label: "Absence" },
                    ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded ${item.bg} border ${item.border}`}></div>
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
                            <p className="text-gray-500 dark:text-gray-400">Đang tải...</p>
                        </div>
                    </div>
                ) : (
                    <div
                        className="grid min-w-max"
                        style={{
                            gridTemplateColumns: `60px 240px repeat(${days.length}, 160px)`
                        }}
                    >
                        {/* HEADER ROW */}
                        <div className="sticky top-0 left-0 z-50 bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 border-b-2 border-gray-300 dark:border-gray-600 px-3 py-3 font-semibold text-gray-700 dark:text-gray-200 text-center">
                            #
                        </div>

                        <div className="sticky top-0 left-[60px] z-50 bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 border-b-2 border-gray-300 dark:border-gray-600 border-l border-gray-300 dark:border-gray-600 px-4 py-3 font-semibold text-gray-700 dark:text-gray-200">
                            Nhân viên
                        </div>

                        {days.map(d => {
                            const today = isToday(d);
                            return (
                                <div
                                    key={d.toString()}
                                    className={`sticky top-0 z-40 border-b-2 border-l border-gray-300 dark:border-gray-600 px-3 py-3 text-center ${today
                                            ? "bg-blue-600 text-white font-bold"
                                            : "bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 text-gray-700 dark:text-gray-200"
                                        }`}
                                >
                                    <div className={`text-xs uppercase ${today ? "text-blue-100" : "text-gray-500 dark:text-gray-400"}`}>
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

                                {/* Col Nhân viên */}
                                <div className="sticky left-[60px] z-40 bg-white dark:bg-gray-800 border-b border-l border-gray-200 dark:border-gray-700 px-4 py-4">
                                    <div className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                                        {emp.name}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                        <span>{emp.department}</span>
                                    </div>
                                </div>

                                {/* Col ngày */}
                                {days.map((d) => {
                                    const shifts = emp.shifts?.filter((s) => sameDay(s.workDate, d));
                                    const today = isToday(d);

                                    return (
                                        <div
                                            key={d.toString()}
                                            className={`border-b border-l border-gray-200 dark:border-gray-700 p-2 ${today ? "bg-blue-50/50 dark:bg-blue-900/10" : "bg-white dark:bg-gray-800"
                                                }`}
                                        >
                                            {(!shifts || shifts.length === 0) ? (
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
                    shiftFilters={filters}
                    setShiftFilters={setFilters}
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

        </div>
    );
}
