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
    } = useSchedule();

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

    return (
        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl shadow-inner w-full">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Schedule & Timesheet</h2>
                <div className="flex gap-2">
                    <button className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-800">
                        <DocumentArrowDownIcon className="w-4 h-4 inline mr-1" /> Export
                    </button>
                    <button
                        onClick={() => setShowAutoAssign(true)}
                        className="px-3 py-2 bg-blue-600 text-white rounded-lg"
                    >
                        <PlusIcon className="w-4 h-4 inline mr-1" /> Phân ca
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
                <div className="flex border rounded-xl">
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

            {/* LEGEND */}
            <div className="flex gap-3 items-center mb-3 flex-wrap text-[12px]">
                {[
                    { color: "blue", label: "Scheduled" },
                    { color: "indigo", label: "In progress" },
                    { color: "green", label: "Completed" },
                    { color: "red", label: "Missed" },
                    { color: "gray", label: "Cancelled" },
                    { color: "amber", label: "Absence" },
                ].map((item) => (
                    <div key={item.label} className="flex items-center gap-1">
                        <span
                            className={`w-3 h-3 rounded bg-${item.color}-300 border border-${item.color}-500`}
                        ></span>
                        <span className="text-gray-700 dark:text-gray-300">{item.label}</span>
                    </div>
                ))}
            </div>


            {/* GRID */}
            <div className="max-h-[70vh] overflow-auto">
                <div
                    className="grid min-w-max"
                    style={{
                        gridTemplateColumns: `60px 220px repeat(${days.length}, 150px)`
                    }}
                >
                    {/* HEADER ROW */}
                    <div className="border px-3 py-2 sticky top-0 left-0 
                        bg-gray-100 dark:bg-gray-700 
                        z-[50]">
                        #
                    </div>

                    <div className="border px-3 py-2 sticky top-0 left-[60px]
                        bg-gray-100 dark:bg-gray-700 
                        z-[50]">
                        Nhân viên
                    </div>

                    {days.map(d => (
                        <div
                            key={d.toString()}
                            className="border px-2 py-2 text-center sticky top-0 
                           bg-gray-100 dark:bg-gray-700 
                           z-[40]"
                        >
                            {d.format("dd DD/MM")}
                        </div>
                    ))}


                    {/* BODY ROWS */}
                    {schedules.map((emp, i) => (
                        <React.Fragment key={emp.id}>

                            {/* Col # */}
                            <div
                                className="
                        border px-3 py-2 sticky left-0
                        bg-gray-50 dark:bg-gray-900
                        z-[40]
                    "
                            >
                                {i + 1}
                            </div>

                            {/* Col Nhân viên */}
                            <div
                                className="
                        border px-3 py-2 sticky left-[60px]
                        bg-gray-50 dark:bg-gray-900
                        z-[40]
                    "
                            >
                                <div className="font-medium">{emp.name}</div>
                                <div className="text-xs text-gray-500">{emp.department}</div>
                            </div>

                            {/* Col ngày */}
                            {days.map((d) => {
                                const shifts = emp.shifts?.filter((s) => sameDay(s.workDate, d));

                                return (
                                    <div key={d.toString()} className="border px-2 py-2">
                                        {(!shifts || shifts.length === 0) ? (
                                            <button
                                                className="w-full h-8 border border-dashed rounded-lg text-gray-400 hover:bg-gray-100"
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
                                                +
                                            </button>
                                        ) : (
                                            <div className="flex flex-col gap-1">
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
