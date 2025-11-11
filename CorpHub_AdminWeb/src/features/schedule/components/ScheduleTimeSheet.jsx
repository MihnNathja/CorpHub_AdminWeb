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
} from "@heroicons/react/24/outline";

import { useSchedule } from "../hooks/useSchedule";

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

const STATUS_STYLE = {
    SCHEDULED: {
        bg: "bg-blue-50",
        border: "border-blue-300",
        text: "text-blue-700",
    },
    IN_PROGRESS: {
        bg: "bg-indigo-50",
        border: "border-indigo-300",
        text: "text-indigo-700",
    },
    COMPLETED: {
        bg: "bg-green-50",
        border: "border-green-300",
        text: "text-green-700",
    },
    MISSED: {
        bg: "bg-red-50",
        border: "border-red-300",
        text: "text-red-700",
    },
    CANCELLED: {
        bg: "bg-gray-100",
        border: "border-gray-300",
        text: "text-gray-500",
    },
    LEAVE: {
        bg: "bg-amber-50",
        border: "border-amber-300",
        text: "text-amber-700",
    },
};



// Shift card
const ShiftCard = ({ shift }) => {
    // shift.status = "SCHEDULED" | "COMPLETED" | ...

    const style = STATUS_STYLE[shift.status] || STATUS_STYLE.SCHEDULED;

    return (
        <div
            className={`w-full border ${style.border} ${style.bg} ${style.text} rounded-lg px-2 py-1 text-[11px]`}
        >
            <div className="font-semibold truncate">
                {shift.title}
            </div>

            <div>
                {dayjs(shift.start).format("HH:mm")} – {dayjs(shift.end).format("HH:mm")}
            </div>

            {shift.notes && <div>{shift.notes}</div>}
        </div>
    );
};


export default function ScheduleTimesheet() {
    const [view, setView] = useState("week");
    const [anchor, setAnchor] = useState(dayjs());

    const {
        schedules,
        from,
        to,
        setFrom,
        setTo,
        loading,
    } = useSchedule();

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

    return (
        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl shadow-inner w-full">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Schedule & Timesheet</h2>
                <div className="flex gap-2">
                    <button className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-800">
                        <DocumentArrowDownIcon className="w-4 h-4 inline mr-1" /> Export
                    </button>
                    <button className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-800">
                        <PlusIcon className="w-4 h-4 inline mr-1" /> Create shift
                    </button>
                    <button className="px-3 py-2 bg-green-600 text-white rounded-lg">
                        <CheckCircleIcon className="w-4 h-4 inline mr-1" /> Approve
                    </button>
                </div>
            </div>

            {/* FILTER BAR */}
            <div className="flex items-center gap-3 mb-4">
                <button onClick={prev} className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-800">
                    <ArrowLeftIcon className="w-4 h-4" />
                </button>

                <div className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 min-w-[180px]">
                    {periodLabel}
                </div>

                <button onClick={next} className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-800">
                    <ArrowRightIcon className="w-4 h-4" />
                </button>

                {/* View Switch */}
                <div className="flex border rounded-xl overflow-hidden">
                    <button
                        onClick={switchToWeek}
                        className={`px-3 py-2 text-sm ${view === "week" ? "bg-blue-600 text-white" : "bg-white dark:bg-gray-800"
                            }`}
                    >
                        Tuần
                    </button>

                    <button
                        onClick={switchToMonth}
                        className={`px-3 py-2 text-sm border-l ${view === "month" ? "bg-blue-600 text-white" : "bg-white dark:bg-gray-800"
                            }`}
                    >
                        Tháng
                    </button>
                </div>
            </div>

            {/* GRID */}
            <div className="max-h-[70vh] overflow-auto w-full">

                {loading && (
                    <div className="p-4 text-center text-gray-500">Đang tải...</div>
                )}

                {/* HEADER ROW */}
                <div
                    className="grid sticky top-0 z-30 bg-gray-100 dark:bg-gray-700"
                    style={{
                        gridTemplateColumns: `60px 220px repeat(${days.length}, 150px)`,
                    }}
                >
                    <div className="border px-3 py-2 sticky left-0 bg-gray-100 z-40">#</div>
                    <div className="border px-3 py-2 sticky left-[60px] bg-gray-100 z-40">
                        Nhân viên
                    </div>

                    {days.map((d) => (
                        <div key={d} className="border px-2 py-2 text-center">
                            {d.format("dd DD/MM")}
                        </div>
                    ))}
                </div>

                {/* BODY */}
                {schedules.map((emp, i) => (
                    <div
                        key={emp.id}
                        className="grid hover:bg-gray-50 dark:hover:bg-gray-700"
                        style={{
                            gridTemplateColumns: `60px 220px repeat(${days.length}, 150px)`,
                        }}
                    >
                        <div className="border px-3 py-2 sticky left-0 bg-white z-30">
                            {i + 1}
                        </div>

                        <div className="border px-3 py-2 sticky left-[60px] bg-white z-30">
                            <div className="font-medium">{emp.name}</div>
                            <div className="text-xs text-gray-500">{emp.department}</div>
                        </div>

                        {days.map((d) => {
                            const shifts = emp.shifts.filter((s) => sameDay(s.workDate, d));

                            return (
                                <div key={d} className="border px-2 py-2">
                                    {shifts.length === 0 ? (
                                        <button className="w-full h-8 border border-dashed rounded-lg text-gray-400">
                                            +
                                        </button>
                                    ) : (
                                        <div className="flex flex-col gap-1">
                                            {shifts.map((s) => (
                                                <ShiftCard
                                                    key={s.id}
                                                    shift={{
                                                        title: s.shiftName,
                                                        start: dayjs(`${s.workDate}T${s.startTime}`),
                                                        end: dayjs(`${s.workDate}T${s.endTime}`),
                                                        notes: s.notes,
                                                        status: s.status,
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
            {/* LEGEND */}
            <div className="flex gap-3 items-center mb-3 flex-wrap text-[12px]">

                <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-blue-300 border border-blue-500"></span>
                    <span className="text-gray-700 dark:text-gray-300">Scheduled</span>
                </div>

                <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-indigo-300 border border-indigo-500"></span>
                    <span className="text-gray-700 dark:text-gray-300">In progress</span>
                </div>

                <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-green-300 border border-green-500"></span>
                    <span className="text-gray-700 dark:text-gray-300">Completed</span>
                </div>

                <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-red-300 border border-red-500"></span>
                    <span className="text-gray-700 dark:text-gray-300">Missed</span>
                </div>

                <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-gray-300 border border-gray-500"></span>
                    <span className="text-gray-700 dark:text-gray-300">Cancelled</span>
                </div>

                <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-amber-300 border border-amber-500"></span>
                    <span className="text-gray-700 dark:text-gray-300">Leave</span>
                </div>
            </div>

        </div>
    );
}
