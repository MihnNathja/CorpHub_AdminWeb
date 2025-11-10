import React, { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";
import { Button } from "../../global/components/button/Button";

const AutoAssignModal = ({ onClose, selectedCount, fromDate, toDate, onConfirm }) => {
    const [pattern, setPattern] = useState("XOAY_CA");
    const [range, setRange] = useState({ from: fromDate, to: toDate });

    const handleConfirm = () => {
        onConfirm({ pattern, range });
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-[420px] shadow-lg">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                        Cấu hình xếp ca tự động
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
                            Phạm vi ngày
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                type="date"
                                value={format(range.from, "yyyy-MM-dd")}
                                onChange={(e) =>
                                    setRange({ ...range, from: new Date(e.target.value) })
                                }
                                className="border rounded-lg px-2 py-1 text-sm w-1/2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                            <span className="text-gray-500 dark:text-gray-400">→</span>
                            <input
                                type="date"
                                value={format(range.to, "yyyy-MM-dd")}
                                onChange={(e) =>
                                    setRange({ ...range, to: new Date(e.target.value) })
                                }
                                className="border rounded-lg px-2 py-1 text-sm w-1/2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Kiểu xếp ca
                        </label>
                        <select
                            value={pattern}
                            onChange={(e) => setPattern(e.target.value)}
                            className="w-full border rounded-lg px-2 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                            <option value="XOAY_CA">Xoay ca (Sáng → Chiều → Nghỉ)</option>
                            <option value="CO_DINH">Cố định (1 ca duy nhất)</option>
                            <option value="NGAY_NGHI">Đặt ngày nghỉ</option>
                        </select>
                    </div>

                    {selectedCount > 0 ? (
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                            🧩 Sẽ áp dụng cho{" "}
                            <span className="font-semibold text-blue-600 dark:text-blue-400">
                                {selectedCount}
                            </span>{" "}
                            nhân viên đã chọn.
                        </div>
                    ) : (
                        <div className="text-sm text-gray-600 dark:text-gray-400 italic">
                            (Chưa chọn nhân viên nào, mặc định áp dụng cho toàn bộ)
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end mt-6 gap-2">
                    <Button
                        variant="outline"
                        className="border-gray-400 dark:border-gray-600"
                        onClick={onClose}
                    >
                        Hủy
                    </Button>
                    <Button
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={handleConfirm}
                    >
                        Áp dụng
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AutoAssignModal;
