import React, { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

/**
 * Modal thêm / sửa lịch làm việc (Work Schedule)
 *
 * @param {Object} props
 * @param {Object} [props.schedule] - Lịch đang chỉnh sửa (nếu có)
 * @param {Function} props.onClose - Đóng modal
 * @param {Function} props.onSubmit - Gửi dữ liệu (thêm hoặc cập nhật)
 */
const WorkScheduleModal = ({ schedule, onClose, onSubmit }) => {
    const [form, setForm] = useState(
        schedule || {
            user: "",
            shift: "",
            workDate: "",
            status: "SCHEDULED",
        }
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = () => {
        if (!form.user || !form.shift || !form.workDate) {
            alert("Vui lòng nhập đủ thông tin!");
            return;
        }
        onSubmit(form);
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-[420px] shadow-lg">
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
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Nhân viên
                        </label>
                        <input
                            type="text"
                            name="user"
                            value={form.user}
                            onChange={handleChange}
                            placeholder="Tên nhân viên"
                            className="w-full border rounded-lg p-2 bg-transparent 
                border-gray-300 dark:border-gray-600 
                dark:bg-gray-700 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Ca làm
                        </label>
                        <input
                            type="text"
                            name="shift"
                            value={form.shift}
                            onChange={handleChange}
                            placeholder="Tên ca làm"
                            className="w-full border rounded-lg p-2 bg-transparent 
                border-gray-300 dark:border-gray-600 
                dark:bg-gray-700 dark:text-white"
                        />
                    </div>

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
                            <option value="COMPLETED">COMPLETED</option>
                            <option value="MISSED">MISSED</option>
                            <option value="CANCELED">CANCELED</option>
                        </select>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end mt-6 gap-2">
                    <button
                        variant="outline"
                        className="border-gray-400 dark:border-gray-600"
                        onClick={onClose}
                    >
                        Hủy
                    </button>
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={handleSubmit}
                    >
                        {schedule ? "Cập nhật" : "Thêm mới"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WorkScheduleModal;
