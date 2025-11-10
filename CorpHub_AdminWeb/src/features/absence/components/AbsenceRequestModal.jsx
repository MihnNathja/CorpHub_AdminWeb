import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { useAbsenceType } from "../hooks/useAbsenceType";

const AbsenceRequestModal = ({ onClose, onSubmit, editingItem }) => {
    const { absenceTypes } = useAbsenceType();

    const [form, setForm] = useState({
        absenceTypeId: "",
        startDate: "",
        endDate: "",
        reason: "",
        attachment: null,
    });

    const [selectedType, setSelectedType] = useState(null);

    useEffect(() => {
        if (editingItem) {
            setForm({
                absenceTypeId: editingItem.absenceTypeId,
                startDate: dayjs(editingItem.startDate).format("YYYY-MM-DD"),
                endDate: dayjs(editingItem.endDate).format("YYYY-MM-DD"),
                reason: editingItem.reason,
                attachment: null,
            });
            const type = absenceTypes.find((t) => t.id === editingItem.absenceTypeId);
            setSelectedType(type || null);
        }
    }, [editingItem, absenceTypes]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));

        if (name === "absenceTypeId") {
            const type = absenceTypes.find((t) => t.id === value);
            setSelectedType(type || null);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        setForm((prev) => ({ ...prev, attachment: file }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Nếu loại nghỉ yêu cầu minh chứng nhưng chưa đính kèm file → báo lỗi
        if (selectedType?.requireProof && !form.attachment) {
            alert("Vui lòng đính kèm giấy tờ minh chứng cho loại nghỉ này!");
            return;
        }

        // Tạo form data nếu có file upload
        const submitData = new FormData();
        Object.entries(form).forEach(([key, value]) => {
            if (value !== null) submitData.append(key, value);
        });

        onSubmit(submitData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-xl">
                <h2 className="text-lg font-semibold mb-5 text-gray-800 dark:text-gray-100">
                    {editingItem ? "Chỉnh sửa đơn nghỉ" : "Tạo đơn nghỉ mới"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* ========== LOẠI NGHỈ ========== */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Loại nghỉ
                        </label>
                        <select
                            name="absenceTypeId"
                            value={form.absenceTypeId}
                            onChange={handleChange}
                            required
                            className="w-full mt-1 px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        >
                            <option value="">-- Chọn loại nghỉ --</option>
                            {absenceTypes.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.name}
                                </option>
                            ))}
                        </select>

                        {/* Gợi ý nếu loại nghỉ yêu cầu minh chứng */}
                        {selectedType?.requireProof && (
                            <p className="text-xs text-yellow-600 mt-1">
                                ⚠️ Loại nghỉ này yêu cầu minh chứng (giấy khám bệnh, v.v.)
                            </p>
                        )}
                    </div>

                    {/* ========== NGÀY NGHỈ ========== */}
                    <div className="flex gap-3">
                        <div className="flex-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Từ ngày
                            </label>
                            <input
                                type="date"
                                name="startDate"
                                value={form.startDate}
                                onChange={handleChange}
                                required
                                className="w-full mt-1 px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Đến ngày
                            </label>
                            <input
                                type="date"
                                name="endDate"
                                value={form.endDate}
                                onChange={handleChange}
                                required
                                className="w-full mt-1 px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* ========== LÝ DO ========== */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Lý do
                        </label>
                        <textarea
                            name="reason"
                            value={form.reason}
                            onChange={handleChange}
                            placeholder="Nhập lý do nghỉ..."
                            required
                            rows={3}
                            className="w-full mt-1 px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none"
                        />
                    </div>

                    {/* ========== FILE MINH CHỨNG ========== */}
                    {selectedType?.requireProof && (
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Đính kèm giấy tờ minh chứng
                            </label>
                            <input
                                type="file"
                                accept=".jpg,.png,.pdf"
                                onChange={handleFileChange}
                                className="w-full mt-1 text-sm text-gray-700 dark:text-gray-200 file:mr-4 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                            />
                        </div>
                    )}

                    {/* ========== NÚT HÀNH ĐỘNG ========== */}
                    <div className="flex justify-end gap-3 pt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-500 transition"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
                        >
                            {editingItem ? "Cập nhật" : "Tạo mới"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AbsenceRequestModal;
