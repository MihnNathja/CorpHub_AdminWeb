import React, { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const ShiftModal = ({ shift, onClose, onSubmit }) => {
    const [form, setForm] = useState(
        shift || {
            name: "",
            startTime: "08:00",
            endTime: "17:00",
            workingHours: 8,
            isNightShift: false,
        }
    );

    // 🔹 Hàm tính số giờ làm giữa hai mốc
    const calculateHours = (start, end) => {
        const [sh, sm] = start.split(":").map(Number);
        const [eh, em] = end.split(":").map(Number);
        let startMins = sh * 60 + sm;
        let endMins = eh * 60 + em;

        // Ca qua đêm → cộng thêm 24h
        if (endMins < startMins) endMins += 24 * 60;

        const totalHours = (endMins - startMins) / 60;
        return Math.round(totalHours * 100) / 100; // làm tròn 2 chữ số
    };

    // 🔹 Cập nhật giờ công mỗi khi thay đổi start hoặc end
    useEffect(() => {
        if (form.startTime && form.endTime) {
            const newHours = calculateHours(form.startTime, form.endTime);
            setForm((prev) => ({
                ...prev,
                workingHours: newHours,
                isNightShift: form.endTime < form.startTime, // tự động đánh dấu ca đêm
            }));
        }
    }, [form.startTime, form.endTime]);

    // 🔹 Xử lý thay đổi input
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    };

    const handleSubmit = () => {
        if (!form.name) {
            alert("Vui lòng nhập tên ca!");
            return;
        }
        onSubmit(form);
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-[420px]">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                        {shift ? "Chỉnh sửa Ca làm" : "Thêm Ca làm"}
                    </h3>
                    <button onClick={onClose}>
                        <XMarkIcon className="w-5 h-5 text-gray-500 dark:text-gray-300" />
                    </button>
                </div>

                {/* Form nội dung */}
                <div className="space-y-3">
                    {/* Tên ca */}
                    <input
                        className="w-full border rounded p-2 bg-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        name="name"
                        placeholder="Tên ca"
                        value={form.name}
                        onChange={handleChange}
                    />

                    {/* Giờ bắt đầu - kết thúc */}
                    <div className="flex gap-2">
                        <div className="w-1/2">
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                                Bắt đầu
                            </label>
                            <input
                                type="time"
                                name="startTime"
                                className="w-full border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                value={form.startTime}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="w-1/2">
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                                Kết thúc
                            </label>
                            <input
                                type="time"
                                name="endTime"
                                className="w-full border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                value={form.endTime}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Giờ công */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                            Giờ công
                        </label>
                        <input
                            type="number"
                            step="0.25"
                            name="workingHours"
                            placeholder="Giờ công"
                            className="w-full border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            value={form.workingHours}
                            onChange={handleChange} // cho phép chỉnh tay nếu cần
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            (Tự tính theo giờ bắt đầu - kết thúc, nhưng có thể chỉnh lại thủ công)
                        </p>
                    </div>

                    {/* Ca đêm */}
                    <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <input
                            type="checkbox"
                            name="isNightShift"
                            checked={form.isNightShift}
                            onChange={handleChange}
                        />
                        Là ca đêm
                    </label>
                </div>

                {/* Footer */}
                <div className="flex justify-end mt-5 gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        Lưu
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShiftModal;
