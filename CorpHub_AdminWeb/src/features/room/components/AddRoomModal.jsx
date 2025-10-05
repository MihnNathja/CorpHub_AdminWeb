import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const AddRoomModal = ({ isOpen, onClose, room, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: "",
        type: "",
        capacity: "",
        area: "",
        status: "AVAILABLE",
    });

    useEffect(() => {
        if (room) {
            setFormData(room);
        } else {
            setFormData({
                name: "",
                type: "",
                capacity: "",
                area: "",
                status: "AVAILABLE",
            });
        }
    }, [room]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = () => {
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6 relative">
                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                    {room ? "Cập nhật phòng" : "Thêm phòng mới"}
                </h2>

                <div className="space-y-3">
                    <input
                        type="text"
                        name="name"
                        placeholder="Tên phòng"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-white"
                    />
                    <input
                        type="text"
                        name="type"
                        placeholder="Loại phòng (họp, làm việc...)"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-white"
                    />
                    <input
                        type="number"
                        name="capacity"
                        placeholder="Sức chứa"
                        value={formData.capacity}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-white"
                    />
                    <input
                        type="number"
                        name="area"
                        placeholder="Diện tích (m²)"
                        value={formData.area}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-white"
                    />
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-white"
                    >
                        <option value="AVAILABLE">AVAILABLE</option>
                        <option value="BUSY">BUSY</option>
                        <option value="MAINTENANCE">MAINTENANCE</option>
                    </select>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                    >
                        {room ? "Cập nhật" : "Thêm mới"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddRoomModal;
