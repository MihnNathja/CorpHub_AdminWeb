import React, { useState } from "react";
import dayjs from "dayjs";
import { XMarkIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

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
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        if (!shiftId) newErrors.shiftId = "Vui lòng chọn ca làm việc";
        if (!startDate) newErrors.startDate = "Vui lòng chọn ngày bắt đầu";
        if (!endDate) newErrors.endDate = "Vui lòng chọn ngày kết thúc";
        if (startDate && endDate && dayjs(endDate).isBefore(dayjs(startDate))) {
            newErrors.endDate = "Ngày kết thúc phải sau ngày bắt đầu";
        }
        if (departmentIds.length === 0) {
            newErrors.departments = "Vui lòng chọn ít nhất một phòng ban";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

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
        setLoading(true);
        try {
            await autoAssign(body);
            onClose();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-[960px] max-h-[92vh] overflow-hidden relative flex flex-col border border-gray-200 dark:border-gray-700">
                {/* HEADER */}
                <div className="flex items-center justify-between px-8 py-5 border-b dark:border-gray-700 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm">
                            <CheckCircleIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Phân ca tự động</h2>
                            <p className="text-xs text-white/80">Tạo lịch làm việc tự động cho nhân viên</p>
                        </div>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onClose}
                        className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </motion.button>
                </div>

                {/* BODY */}
                <form
                    onSubmit={handleSubmit}
                    className="flex-1 overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-2 gap-8"
                >
                    {/* LEFT COLUMN */}
                    <div className="flex flex-col gap-6">
                        {/* Shift - REQUIRED */}
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">
                                Ca làm việc <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    required
                                    placeholder="Tìm kiếm hoặc chọn ca làm việc..."
                                    value={
                                        shiftFilters.keyword || shifts.find((s) => s.id === shiftId)?.name || ""
                                    }
                                    onChange={(e) => {
                                        setShiftFilters({ ...shiftFilters, keyword: e.target.value });
                                        setShiftId("");
                                        setErrors((prev) => ({ ...prev, shiftId: "" }));
                                    }}
                                    className={`w-full border-2 rounded-xl px-4 py-3 transition-all
                                        ${errors.shiftId
                                            ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/20"
                                            : "border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
                                        }
                                        bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 
                                        focus:outline-none placeholder:text-gray-400`}
                                />
                                {shiftFilters.keyword && shifts?.length > 0 && (
                                    <div className="absolute mt-2 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-xl max-h-48 overflow-y-auto w-full z-50">
                                        {shifts.map((shift) => (
                                            <div
                                                key={shift.id}
                                                onClick={() => {
                                                    setShiftId(shift.id);
                                                    setShiftFilters({ ...shiftFilters, keyword: "" });
                                                    setErrors((prev) => ({ ...prev, shiftId: "" }));
                                                }}
                                                className={`px-4 py-3 text-sm cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors ${shiftId === shift.id
                                                        ? "bg-blue-100 dark:bg-blue-900/40"
                                                        : ""
                                                    }`}
                                            >
                                                <div className="font-semibold text-gray-900 dark:text-gray-100">{shift.name}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    {shift.startTime} – {shift.endTime}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {errors.shiftId && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1"
                                >
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.shiftId}
                                </motion.p>
                            )}
                        </div>

                        {/* Date Range - REQUIRED */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">
                                    Từ ngày <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    required
                                    value={startDate}
                                    onChange={(e) => {
                                        setStartDate(e.target.value);
                                        setErrors((prev) => ({ ...prev, startDate: "" }));
                                    }}
                                    className={`w-full border-2 rounded-xl px-4 py-3 transition-all
                                        ${errors.startDate
                                            ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/20"
                                            : "border-gray-200 dark:border-gray-700 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
                                        }
                                        bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 
                                        focus:outline-none cursor-pointer`}
                                />
                                {errors.startDate && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1"
                                    >
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.startDate}
                                    </motion.p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">
                                    Đến ngày <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    required
                                    value={endDate}
                                    onChange={(e) => {
                                        setEndDate(e.target.value);
                                        setErrors((prev) => ({ ...prev, endDate: "" }));
                                    }}
                                    className={`w-full border-2 rounded-xl px-4 py-3 transition-all
                                        ${errors.endDate
                                            ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/20"
                                            : "border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20"
                                        }
                                        bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 
                                        focus:outline-none cursor-pointer`}
                                />
                                {errors.endDate && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1"
                                    >
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.endDate}
                                    </motion.p>
                                )}
                            </div>
                        </div>

                        {/* User Selection - OPTIONAL */}
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">
                                Nhân viên (tùy chọn)
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm nhân viên..."
                                    value={userKeyword}
                                    onChange={(e) => setUserKeyword(e.target.value)}
                                    className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:outline-none transition-all placeholder:text-gray-400"
                                />
                                {userKeyword && users?.length > 0 && (
                                    <div className="absolute mt-2 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-xl max-h-48 overflow-y-auto w-full z-50">
                                        {users.map((user) => (
                                            <div
                                                key={user.id}
                                                onClick={() => {
                                                    if (!selectedUsers.some((u) => u.id === user.id)) {
                                                        setSelectedUsers([...selectedUsers, user]);
                                                    }
                                                    setUserKeyword("");
                                                }}
                                                className="px-4 py-3 text-sm cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors"
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
                                <div className="mt-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 p-3 max-h-28 overflow-y-auto">
                                    <div className="flex flex-wrap gap-2">
                                        {selectedUsers.map((u) => (
                                            <div
                                                key={u.id}
                                                className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium"
                                            >
                                                <span className="truncate max-w-[140px]">{u.fullName}</span>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setSelectedUsers(
                                                            selectedUsers.filter((x) => x.id !== u.id)
                                                        )
                                                    }
                                                    className="text-blue-600 hover:text-red-500 transition-colors"
                                                >
                                                    <XMarkIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-right font-medium">
                                        {selectedUsers.length} nhân viên đã chọn
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Advanced Options */}
                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                                Tùy chọn nâng cao
                            </label>
                            <div className="space-y-3 text-sm pl-1">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={replaceExisting}
                                        onChange={(e) => setReplaceExisting(e.target.checked)}
                                        className="w-4 h-4 accent-blue-600 cursor-pointer"
                                    />
                                    <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
                                        Ghi đè các ca đã có
                                    </span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={respectAbsenceRequests}
                                        onChange={(e) => setRespectAbsenceRequests(e.target.checked)}
                                        className="w-4 h-4 accent-blue-600 cursor-pointer"
                                    />
                                    <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
                                        Bỏ qua nhân viên có nghỉ phép đã duyệt
                                    </span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={includeWeekend}
                                        onChange={(e) => setIncludeWeekend(e.target.checked)}
                                        className="w-4 h-4 accent-blue-600 cursor-pointer"
                                    />
                                    <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
                                        Bao gồm Thứ 7 & CN
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="flex flex-col">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                            Phòng ban <span className="text-red-500">*</span>
                        </label>
                        <div className={`border-2 rounded-xl p-4 flex flex-col flex-1 transition-all
                            ${errors.departments
                                ? "border-red-500 bg-red-50 dark:bg-red-900/10"
                                : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                            }`}>
                            {departments.length > 0 ? (
                                <>
                                    <div className="grid grid-cols-1 gap-2 overflow-y-auto pr-2 custom-scrollbar"
                                        style={{ maxHeight: "320px" }}>
                                        {departments.map((dept) => {
                                            const checked = departmentIds.includes(dept.id);
                                            return (
                                                <label
                                                    key={dept.id}
                                                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-all ${checked
                                                            ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 shadow-sm"
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
                                                            setErrors((prev) => ({ ...prev, departments: "" }));
                                                        }}
                                                        className="w-4 h-4 accent-blue-600 cursor-pointer"
                                                    />
                                                    <span className="text-sm font-medium truncate">{dept.name}</span>
                                                </label>
                                            );
                                        })}
                                    </div>

                                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 text-xs">
                                        <div className="flex gap-4">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setDepartmentIds(departments.map((d) => d.id));
                                                    setErrors((prev) => ({ ...prev, departments: "" }));
                                                }}
                                                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                                            >
                                                Chọn tất cả
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setDepartmentIds([])}
                                                className="text-red-500 dark:text-red-400 hover:underline font-medium"
                                            >
                                                Bỏ chọn
                                            </button>
                                        </div>
                                        <span className="text-gray-600 dark:text-gray-400 font-semibold">
                                            {departmentIds.length}/{departments.length} đã chọn
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                                    Không có dữ liệu phòng ban
                                </div>
                            )}
                        </div>
                        {errors.departments && (
                            <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-xs text-red-600 dark:text-red-400 mt-2 flex items-center gap-1"
                            >
                                <AlertCircle className="w-3 h-3" />
                                {errors.departments}
                            </motion.p>
                        )}
                    </div>

                    {/* FOOTER */}
                    <div className="col-span-full flex justify-end gap-3 pt-6 border-t dark:border-gray-700">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            Hủy
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold flex items-center gap-2 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Đang phân ca..." : "Phân ca"}
                            {!loading && <CheckCircleIcon className="w-5 h-5" />}
                        </motion.button>
                    </div>

                    {resultCount !== null && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="col-span-full p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-sm font-semibold flex items-center gap-2"
                        >
                            <CheckCircleIcon className="w-5 h-5" />
                            Đã tạo {resultCount} lịch làm việc tự động.
                        </motion.div>
                    )}
                </form>
            </div>
        </div>
    );
}
