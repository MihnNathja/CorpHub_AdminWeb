import React, { useState, useEffect } from "react";
import { XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const WorkScheduleModal = ({
    schedule,
    shifts = [],
    users = [],
    userKeyword,
    setUserKeyword,
    onClose,
    onSubmit,
    onDelete
}) => {
    const [form, setForm] = useState(
        schedule || {
            id: "",
            userId: "",
            shiftId: "",
            workDate: "",
            status: "SCHEDULED",
        }
    );
    console.log(schedule);

    useEffect(() => {
        if (schedule) {
            setForm({
                id: schedule.id || "",
                userId: schedule.userId || "",
                shiftId: schedule.shiftId || "",
                workDate: schedule.workDate || "",
                status: schedule.status || "SCHEDULED",
            });

            // ✅ Hiển thị sẵn tên nhân viên
            if (schedule.fullName) {
                setUserKeyword(schedule.fullName);
            } else if (schedule.userId) {
                const user = users.find((u) => u.id === schedule.userId);
                if (user) setUserKeyword(user.fullName);
            }
        } else {
            setForm({
                userId: "",
                shiftId: "",
                workDate: "",
                status: "SCHEDULED",
            });
            setUserKeyword("");
        }
    }, [schedule, users, setUserKeyword]);

    // ✅ Lấy tên ca làm hiện tại để hiển thị
    const currentShift =
        shifts.find((s) => s.id === form.shiftId) || schedule?.shift || null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectUser = (user) => {
        setForm((prev) => ({ ...prev, userId: user.id }));
        setUserKeyword(user.fullName);
    };

    const handleSubmit = () => {
        if (!form.userId || !form.shiftId || !form.workDate) {
            alert("Vui lòng nhập đủ thông tin!");
            return;
        }
        onSubmit(form);
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setUserKeyword(value);
        setForm((prev) => ({ ...prev, userId: "" }));
    };

    const handleDelete = () => {
        if (!schedule?.id) return;

        if (window.confirm("Bạn có chắc muốn xóa lịch làm việc này không?")) {
            onDelete(schedule.id);
        }
    };


    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-[450px] shadow-lg">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                        {schedule ? "Chỉnh sửa lịch làm việc" : "Thêm lịch làm việc"}
                    </h3>
                    <button
                        onClick={onClose}
                        className="hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded-lg"
                    >
                        <XMarkIcon className="w-5 h-5 text-gray-500 dark:text-gray-300" />
                    </button>
                </div>

                {/* Body */}
                <div className="space-y-4">
                    {/* 🧑 Nhân viên */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Nhân viên
                        </label>
                        <div className="relative">
                            <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                            <input
                                type="text"
                                placeholder="Tìm nhân viên..."
                                value={
                                    userKeyword ||
                                    users.find((u) => u.id === form.userId)?.fullName ||
                                    ""
                                }
                                onChange={handleInputChange}
                                className="w-full border rounded-lg pl-8 pr-2 py-2 bg-transparent 
                border-gray-300 dark:border-gray-600 
                dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        {/* Dropdown khi đang nhập */}
                        {userKeyword.trim() !== "" && users.length > 0 && (
                            <div className="max-h-[150px] mt-1 overflow-y-auto border rounded-lg bg-white dark:bg-gray-700">
                                {users.map((u) => (
                                    <button
                                        key={u.id}
                                        type="button"
                                        onClick={() => handleSelectUser(u)}
                                        className={`block w-full text-left px-3 py-2 text-sm hover:bg-blue-50 dark:hover:bg-gray-600 ${form.userId === u.id
                                            ? "bg-blue-100 dark:bg-gray-600 font-semibold"
                                            : ""
                                            }`}
                                    >
                                        {u.fullName}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ⏰ Ca làm */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Ca làm
                        </label>
                        <select
                            name="shiftId"
                            value={form.shiftId}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2 bg-transparent 
              border-gray-300 dark:border-gray-600 
              dark:bg-gray-700 dark:text-white"
                        >
                            <option value="">
                                {currentShift
                                    ? `${currentShift.name} (${currentShift.startTime} - ${currentShift.endTime})`
                                    : "-- Chọn ca làm --"}
                            </option>
                            {shifts.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.name} ({s.startTime} - {s.endTime})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 📅 Ngày làm việc */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Ngày làm việc
                        </label>
                        <input
                            type="date"
                            name="workDate"
                            value={form.workDate}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2 bg-transparent 
              border-gray-300 dark:border-gray-600 
              dark:bg-gray-700 dark:text-white"
                        />
                    </div>

                    {/* 🟢 Trạng thái */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Trạng thái
                        </label>
                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2 bg-transparent 
              border-gray-300 dark:border-gray-600 
              dark:bg-gray-700 dark:text-white"
                        >
                            <option value="SCHEDULED">SCHEDULED</option>
                            <option value="IN_PROGRESS">IN_PROGRESS</option>
                            <option value="COMPLETED">COMPLETED</option>
                            <option value="MISSED">MISSED</option>
                            <option value="CANCELLED">CANCELLED</option>
                            <option value="ABSENCE">ABSENCE</option>
                        </select>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center mt-6">

                    {/* ❗ Nút Delete chỉ hiện khi đang EDIT */}
                    {schedule?.id && (
                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 border rounded-lg border-red-400 text-red-600 
                       hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                            Xóa
                        </button>
                    )}

                    <div className="flex gap-2 ml-auto">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border rounded-lg border-gray-400 dark:border-gray-600"
                        >
                            Hủy
                        </button>

                        <button
                            onClick={handleSubmit}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 
                       text-white rounded-lg"
                        >
                            {schedule ? "Cập nhật" : "Thêm mới"}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default WorkScheduleModal;
