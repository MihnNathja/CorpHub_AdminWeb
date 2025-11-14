import React, { useState } from "react";
import dayjs from "dayjs";
import { XMarkIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

export default function AutoAssignModal({ onClose, departments = [], shifts, shiftFilters, setShiftFilters, users, userKeyword, setUserKeyword, autoAssign }) {
    const [shiftId, setShiftId] = useState("");
    const [departmentIds, setDepartmentIds] = useState([]);
    const [startDate, setStartDate] = useState(dayjs().format("YYYY-MM-DD"));
    const [endDate, setEndDate] = useState(dayjs().add(6, "day").format("YYYY-MM-DD"));
    const [replaceExisting, setReplaceExisting] = useState(false);
    const [respectAbsenceRequests, setRespectAbsenceRequests] = useState(true);
    const [includeWeekend, setIncludeWeekend] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultCount, setResultCount] = useState(null);

    const [selectedUsers, setSelectedUsers] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const body = {
            shiftId,
            departmentIds,
            userIds: selectedUsers.map((u) => u.id),
            startDate,
            endDate,
            replaceExisting,
            respectAbsenceRequests,
            includeWeekend,
        };
        await autoAssign(body);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-[960px] max-h-[92vh] overflow-hidden relative flex flex-col">
                {/* HEADER */}
                <div className="flex items-center justify-between px-8 py-5 border-b dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-10">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Phân ca tự động</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* BODY */}
                <form
                    onSubmit={handleSubmit}
                    className="flex-1 overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-2 gap-8"
                >
                    {/* LEFT COLUMN */}
                    <div className="flex flex-col gap-6">
                        {/* Shift */}
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
                                Ca làm việc
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm hoặc chọn ca làm việc..."
                                    value={
                                        shiftFilters.keyword || shifts.find((s) => s.id === shiftId)?.name || ""
                                    }
                                    onChange={(e) => {
                                        setShiftFilters({ ...shiftFilters, keyword: e.target.value });
                                        setShiftId("");
                                    }}
                                    className="w-full border rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-400 outline-none transition"
                                />
                                {shiftFilters.keyword && shifts?.length > 0 && (
                                    <div className="absolute mt-1 border rounded-lg bg-white dark:bg-gray-800 shadow-lg max-h-48 overflow-y-auto w-full z-50">
                                        {shifts.map((shift) => (
                                            <div
                                                key={shift.id}
                                                onClick={() => {
                                                    setShiftId(shift.id);
                                                    setShiftFilters({ ...shiftFilters, keyword: "" });
                                                }}
                                                className={`px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 ${shiftId === shift.id
                                                    ? "bg-blue-100 dark:bg-blue-900/40"
                                                    : ""
                                                    }`}
                                            >
                                                <div className="font-medium">{shift.name}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    {shift.startTime} – {shift.endTime}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Date Range */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
                                    Từ ngày
                                </label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full border rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-400 outline-none transition"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
                                    Đến ngày
                                </label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full border rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-400 outline-none transition"
                                    required
                                />
                            </div>
                        </div>

                        {/* User Selection */}
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
                                Nhân viên (tùy chọn)
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm nhân viên..."
                                    value={userKeyword}
                                    onChange={(e) => setUserKeyword(e.target.value)}
                                    className="w-full border rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-400 outline-none transition"
                                />
                                {userKeyword && users?.length > 0 && (
                                    <div className="absolute mt-1 border rounded-lg bg-white dark:bg-gray-800 shadow-lg max-h-48 overflow-y-auto w-full z-50">
                                        {users.map((user) => (
                                            <div
                                                key={user.id}
                                                onClick={() => {
                                                    if (!selectedUsers.some((u) => u.id === user.id)) {
                                                        setSelectedUsers([...selectedUsers, user]);
                                                    }
                                                    setUserKeyword("");
                                                }}
                                                className="px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                                            >
                                                {user.fullName}{" "}
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    ({user.department.name})
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Selected users */}
                            {selectedUsers.length > 0 && (
                                <div className="mt-3 border rounded-lg bg-gray-50 dark:bg-gray-900 p-2 max-h-28 overflow-y-auto">
                                    <div className="flex flex-wrap gap-2">
                                        {selectedUsers.map((u) => (
                                            <div
                                                key={u.id}
                                                className="flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 rounded-full text-sm"
                                            >
                                                <span className="truncate max-w-[140px]">{u.fullName}</span>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setSelectedUsers(
                                                            selectedUsers.filter((x) => x.id !== u.id)
                                                        )
                                                    }
                                                    className="text-gray-500 hover:text-red-500"
                                                >
                                                    <XMarkIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-right">
                                        {selectedUsers.length} nhân viên đã chọn
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Advanced Options */}
                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                                Tùy chọn nâng cao
                            </label>
                            <div className="space-y-2 text-sm pl-1">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={replaceExisting}
                                        onChange={(e) => setReplaceExisting(e.target.checked)}
                                        className="accent-blue-600"
                                    />
                                    Ghi đè các ca đã có
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={respectAbsenceRequests}
                                        onChange={(e) => setRespectAbsenceRequests(e.target.checked)}
                                        className="accent-blue-600"
                                    />
                                    Bỏ qua nhân viên có nghỉ phép đã duyệt
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={includeWeekend}
                                        onChange={(e) => setIncludeWeekend(e.target.checked)}
                                        className="accent-blue-600"
                                    />
                                    Bao gồm Thứ 7 & CN
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="flex flex-col">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                            Phòng ban
                        </label>
                        <div className="border rounded-lg bg-gray-50 dark:bg-gray-900 p-4 flex flex-col flex-1">
                            {departments.length > 0 ? (
                                <>
                                    {/* ✅ Scroll riêng, cố định chiều cao */}
                                    <div className="grid grid-cols-2 md:grid-cols-1 gap-2 overflow-y-auto pr-2"
                                        style={{ maxHeight: "320px" }}>
                                        {departments.map((dept) => {
                                            const checked = departmentIds.includes(dept.id);
                                            return (
                                                <label
                                                    key={dept.id}
                                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md cursor-pointer transition ${checked
                                                        ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300"
                                                        : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                                        }`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={checked}
                                                        onChange={(e) => {
                                                            if (e.target.checked)
                                                                setDepartmentIds([...departmentIds, dept.id]);
                                                            else
                                                                setDepartmentIds(
                                                                    departmentIds.filter((id) => id !== dept.id)
                                                                );
                                                        }}
                                                        className="w-4 h-4 accent-blue-600"
                                                    />
                                                    <span className="text-sm truncate">{dept.name}</span>
                                                </label>
                                            );
                                        })}
                                    </div>

                                    {/* ✅ Footer của danh sách */}
                                    <div className="flex justify-between items-center mt-3 text-xs text-gray-500 dark:text-gray-400">
                                        <div className="flex gap-4">
                                            <button
                                                type="button"
                                                onClick={() => setDepartmentIds(departments.map((d) => d.id))}
                                                className="text-blue-600 dark:text-blue-400 hover:underline"
                                            >
                                                Chọn tất cả
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setDepartmentIds([])}
                                                className="text-red-500 dark:text-red-400 hover:underline"
                                            >
                                                Bỏ chọn
                                            </button>
                                        </div>
                                        <span className="italic">
                                            {departmentIds.length}/{departments.length} đã chọn
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
                                    Không có dữ liệu phòng ban
                                </div>
                            )}
                        </div>
                    </div>


                    {/* FOOTER */}
                    <div className="col-span-full flex justify-end gap-3 pt-6 border-t dark:border-gray-700">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2 rounded-lg border bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 transition"
                        >
                            {loading ? "Đang phân ca..." : "Phân ca"}
                            {!loading && <CheckCircleIcon className="w-5 h-5" />}
                        </button>
                    </div>

                    {resultCount !== null && (
                        <div className="col-span-full mt-2 text-green-600 text-sm text-right">
                            ✅ Đã tạo {resultCount} lịch làm việc tự động.
                        </div>
                    )}
                </form>
            </div>
        </div>

    );
}
