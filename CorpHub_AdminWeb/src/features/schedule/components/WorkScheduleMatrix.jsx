import React, { useState, useMemo } from "react";
import {
    ArrowLeftIcon,
    ArrowRightIcon,
    Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { addDays, startOfWeek, format } from "date-fns";
import { vi } from "date-fns/locale";
import { Button } from "../../global/components/button/Button";
import AutoAssignModal from "./AutoAssignModal";

const mockEmployees = [
    { id: 1, name: "Trưởng phòng kế toán", dept: "Kế toán" },
    { id: 2, name: "Kế toán viên 1", dept: "Kế toán" },
    { id: 3, name: "Thủ quỹ", dept: "Kế toán" },
    { id: 4, name: "Kế toán viên 3", dept: "Kế toán" },
];

const shiftCodes = ["HC", "C1", "OFF", "T7", "CN"];

const WorkScheduleMatrix = () => {
    const [currentWeek, setCurrentWeek] = useState(
        startOfWeek(new Date(), { weekStartsOn: 1 })
    );
    const [data, setData] = useState(() =>
        mockEmployees.map((emp) => ({
            ...emp,
            shifts: Array.from({ length: 7 }, () =>
                shiftCodes[Math.floor(Math.random() * shiftCodes.length)]
            ),
        }))
    );
    const [selected, setSelected] = useState([]);
    const [showAutoModal, setShowAutoModal] = useState(false);

    const weekDays = useMemo(() => {
        return Array.from({ length: 7 }, (_, i) => {
            const d = addDays(currentWeek, i);
            return {
                day: format(d, "EEE", { locale: vi }).toUpperCase(),
                date: format(d, "dd/MM"),
                full: d,
            };
        });
    }, [currentWeek]);

    const handlePrevWeek = () => setCurrentWeek(addDays(currentWeek, -7));
    const handleNextWeek = () => setCurrentWeek(addDays(currentWeek, 7));

    const handleChangeShift = (empId, dayIndex) => {
        const newShift = prompt("Nhập mã ca (VD: HC, C1, OFF):");
        if (!newShift) return;
        setData((prev) =>
            prev.map((emp) =>
                emp.id === empId
                    ? {
                        ...emp,
                        shifts: emp.shifts.map((s, i) =>
                            i === dayIndex ? newShift : s
                        ),
                    }
                    : emp
            )
        );
    };

    const handleSelectAll = (checked) => {
        if (checked) setSelected(data.map((e) => e.id));
        else setSelected([]);
    };

    const handleSelectOne = (id) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const isAllSelected = selected.length === data.length && data.length > 0;

    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4 overflow-x-auto">
            {/* Thanh điều hướng tuần */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={handlePrevWeek}>
                        <ArrowLeftIcon className="w-4 h-4" />
                    </Button>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        Tuần {format(currentWeek, "dd/MM")} -{" "}
                        {format(addDays(currentWeek, 6), "dd/MM/yyyy")}
                    </span>
                    <Button size="sm" variant="outline" onClick={handleNextWeek}>
                        <ArrowRightIcon className="w-4 h-4" />
                    </Button>
                </div>

                <Button
                    size="sm"
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => setShowAutoModal(true)}
                >
                    <Cog6ToothIcon className="w-4 h-4" />
                    Tự động xếp ca
                </Button>
            </div>

            {/* Toolbar khi có nhân viên được chọn */}
            {selected.length > 0 && (
                <div className="mb-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3 flex justify-between items-center">
                    <span className="text-sm text-blue-800 dark:text-blue-200">
                        Đã chọn {selected.length} nhân viên
                    </span>
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            color="green"
                            onClick={() => setShowAutoModal(true)}
                            icon={<Cog6ToothIcon className="w-4 h-4" />}
                        >
                            Tự động xếp ca
                        </Button>
                        <Button size="sm" color="gray" variant="outline">
                            Gán ca thủ công
                        </Button>
                    </div>
                </div>
            )}

            {/* Bảng phân ca */}
            <div className="overflow-x-auto max-w-full">
                <table className="min-w-[950px] border-collapse w-full">
                    <thead>
                        <tr className="bg-gray-100 dark:bg-gray-700 sticky top-0 z-10">
                            <th className="border px-3 py-2 text-center w-10">
                                <input
                                    type="checkbox"
                                    checked={isAllSelected}
                                    onChange={(e) => handleSelectAll(e.target.checked)}
                                />
                            </th>
                            <th className="border px-3 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-100 w-10">
                                #
                            </th>
                            <th className="border px-3 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-100 min-w-[200px] sticky left-0 bg-gray-100 dark:bg-gray-800 z-10">
                                Nhân viên
                            </th>
                            {weekDays.map((d, idx) => (
                                <th
                                    key={idx}
                                    className="border px-2 py-2 text-center text-xs font-semibold text-gray-700 dark:text-gray-100"
                                >
                                    {d.day}
                                    <div className="text-[10px] text-gray-500 dark:text-gray-400">
                                        {d.date}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((emp, i) => (
                            <tr
                                key={emp.id}
                                className={`transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 ${selected.includes(emp.id)
                                    ? "bg-blue-50 dark:bg-blue-900/30"
                                    : ""
                                    }`}
                            >
                                <td className="border px-3 py-2 text-center">
                                    <input
                                        type="checkbox"
                                        checked={selected.includes(emp.id)}
                                        onChange={() => handleSelectOne(emp.id)}
                                    />
                                </td>
                                <td className="border px-3 py-2 text-center text-sm text-gray-600 dark:text-gray-300">
                                    {i + 1}
                                </td>
                                <td className="border px-3 py-2 text-sm text-gray-800 dark:text-gray-100 sticky left-0 bg-white dark:bg-gray-800 z-10">
                                    <div className="font-medium">{emp.name}</div>
                                    <div className="text-xs text-gray-500">{emp.dept}</div>
                                </td>
                                {emp.shifts.map((shift, j) => (
                                    <td
                                        key={j}
                                        className="border px-2 py-2 text-center text-sm cursor-pointer select-none hover:bg-blue-50 dark:hover:bg-blue-900/40"
                                        onDoubleClick={() => handleChangeShift(emp.id, j)}
                                    >
                                        <span
                                            className={`px-2 py-1 rounded-md text-xs font-semibold ${shift === "HC"
                                                ? "bg-green-100 text-green-700"
                                                : shift === "OFF"
                                                    ? "bg-gray-100 text-gray-600"
                                                    : "bg-yellow-100 text-yellow-700"
                                                }`}
                                        >
                                            {shift}
                                        </span>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <p className="text-xs text-gray-500 mt-2">
                💡 Gợi ý: Dùng mũi tên để chuyển tuần, nhấn đúp vào ô ca để thay đổi.
            </p>

            {/* Modal xếp ca */}
            {showAutoModal && (
                <AutoAssignModal
                    onClose={() => setShowAutoModal(false)}
                    selectedCount={selected.length}
                    fromDate={currentWeek}
                    toDate={addDays(currentWeek, 6)}
                    onConfirm={() => {
                        alert("✅ Xếp ca tự động thành công (demo)");
                        setShowAutoModal(false);
                    }}
                />
            )}
        </div>
    );
};

export default WorkScheduleMatrix;
