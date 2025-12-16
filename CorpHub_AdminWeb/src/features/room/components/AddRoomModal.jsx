import React, { useState, useEffect } from "react";
import { X, Building2, Users, Maximize2, CheckCircle, AlertCircle, Building } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AddRoomModal = ({ isOpen, onClose, room, departments, roomTypes, onSubmit }) => {

    const [formData, setFormData] = useState({
        name: "",
        typeId: "",
        capacity: "",
        area: "",
        departmentId: "",
        status: "AVAILABLE",
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (room) {
            setFormData({
                name: room.name || "",
                typeId: room.typeId || room.type?.id || "",
                capacity: room.capacity || "",
                area: room.area || "",
                departmentId: room.departmentId || room.department?.id || "",
                status: room.status || "AVAILABLE",
            });
        } else {
            setFormData({
                name: "",
                typeId: "",
                capacity: "",
                area: "",
                departmentId: "",
                status: "AVAILABLE",
            });
        }
        setErrors({});
    }, [room, isOpen]);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        // Clear error when user types
        if (errors[e.target.name]) {
            setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Room name is required";
        if (!formData.typeId) newErrors.typeId = "Room type is required";
        if (!formData.capacity || formData.capacity <= 0) newErrors.capacity = "Capacity must be greater than 0";
        if (!formData.area || formData.area <= 0) newErrors.area = "Area must be greater than 0";
        if (!formData.departmentId) newErrors.departmentId = "Department is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validate()) {
            onSubmit(formData);
        }
    };

    const statusConfig = {
        AVAILABLE: {
            label: "Available",
            color: "text-emerald-600 dark:text-emerald-400",
            bg: "bg-emerald-50 dark:bg-emerald-900/20",
            icon: CheckCircle,
        },
        RESERVED: {
            label: "In use",
            color: "text-amber-600 dark:text-amber-400",
            bg: "bg-amber-50 dark:bg-amber-900/20",
            icon: AlertCircle,
        },
        MAINTENANCE: {
            label: "Maintenance",
            color: "text-red-600 dark:text-red-400",
            bg: "bg-red-50 dark:bg-red-900/20",
            icon: AlertCircle,
        },
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.2 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-gray-200 dark:border-gray-700"
                        >
                            {/* Header with gradient */}
                            <div className="relative bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 px-6 py-5 text-white">
                                <motion.div
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        opacity: [0.3, 0.5, 0.3],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                    className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl"
                                />

                                <div className="relative flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-sm">
                                            <Building2 className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold">
                                                {room ? "Edit room" : "Add new room"}
                                            </h2>
                                            <p className="text-xs text-white/80">
                                                {room ? "Update room information" : "Create a new room in the system"}
                                            </p>
                                        </div>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.1, rotate: 90 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={onClose}
                                        className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </motion.button>
                                </div>
                            </div>

                            {/* Form Content */}
                            <div className="p-6 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                                {/* Room Name - Full Width */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                        Room name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Enter room name..."
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-2.5 rounded-xl border-2 transition-all
                                            ${errors.name
                                                ? "border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/20"
                                                : "border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20"
                                            }
                                            bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                                            placeholder:text-gray-400 dark:placeholder:text-gray-500
                                            focus:outline-none`}
                                    />
                                    {errors.name && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1"
                                        >
                                            <AlertCircle className="w-3 h-3" />
                                            {errors.name}
                                        </motion.p>
                                    )}
                                </div>

                                {/* Grid for Type and Department */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Room Type */}
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            <Building2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                            Room type <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="typeId"
                                            value={formData.typeId}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-2.5 rounded-xl border-2 transition-all
                                                ${errors.typeId
                                                    ? "border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/20"
                                                    : "border-gray-200 dark:border-gray-700 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-4 focus:ring-purple-500/20"
                                                }
                                                bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                                                focus:outline-none cursor-pointer`}
                                        >
                                            <option value="">-- Select room type --</option>
                                            {roomTypes?.map((type) => (
                                                <option key={type.id} value={type.id}>
                                                    {type.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.typeId && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1"
                                            >
                                                <AlertCircle className="w-3 h-3" />
                                                {errors.typeId}
                                            </motion.p>
                                        )}
                                    </div>

                                    {/* Department */}
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            <Building className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                            Department <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="departmentId"
                                            value={formData.departmentId}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-2.5 rounded-xl border-2 transition-all
                                                ${errors.departmentId
                                                    ? "border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/20"
                                                    : "border-gray-200 dark:border-gray-700 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/20"
                                                }
                                                bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                                                focus:outline-none cursor-pointer`}
                                        >
                                            <option value="">-- Select department --</option>
                                            {departments?.map((dept) => (
                                                <option key={dept.id} value={dept.id}>
                                                    {dept.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.departmentId && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1"
                                            >
                                                <AlertCircle className="w-3 h-3" />
                                                {errors.departmentId}
                                            </motion.p>
                                        )}
                                    </div>
                                </div>

                                {/* Grid for Capacity and Area */}
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Capacity */}
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                            Capacity <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            name="capacity"
                                            placeholder="0"
                                            min="1"
                                            value={formData.capacity}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-2.5 rounded-xl border-2 transition-all
                                                ${errors.capacity
                                                    ? "border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/20"
                                                    : "border-gray-200 dark:border-gray-700 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/20"
                                                }
                                                bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                                                placeholder:text-gray-400 dark:placeholder:text-gray-500
                                                focus:outline-none`}
                                        />
                                        {errors.capacity && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1"
                                            >
                                                <AlertCircle className="w-3 h-3" />
                                                {errors.capacity}
                                            </motion.p>
                                        )}
                                    </div>

                                    {/* Area */}
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            <Maximize2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                            Area (m²) <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            name="area"
                                            placeholder="0"
                                            min="1"
                                            step="0.1"
                                            value={formData.area}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-2.5 rounded-xl border-2 transition-all
                                                ${errors.area
                                                    ? "border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/20"
                                                    : "border-gray-200 dark:border-gray-700 focus:border-amber-500 dark:focus:border-amber-400 focus:ring-4 focus:ring-amber-500/20"
                                                }
                                                bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                                                placeholder:text-gray-400 dark:placeholder:text-gray-500
                                                focus:outline-none`}
                                        />
                                        {errors.area && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1"
                                            >
                                                <AlertCircle className="w-3 h-3" />
                                                {errors.area}
                                            </motion.p>
                                        )}
                                    </div>
                                </div>

                                {/* Status */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        <CheckCircle className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                                        Status
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {Object.entries(statusConfig).map(([key, config]) => {
                                            const Icon = config.icon;
                                            const isSelected = formData.status === key;
                                            return (
                                                <motion.button
                                                    key={key}
                                                    type="button"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => setFormData((prev) => ({ ...prev, status: key }))
                                                    }
                                                    className={`relative p-3 rounded-xl border-2 transition-all text-center
                                                        ${isSelected
                                                            ? `${config.bg} border-current ${config.color} shadow-lg`
                                                            : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600"
                                                        }`}
                                                >
                                                    <Icon className={`w-5 h-5 mx-auto mb-1 ${isSelected ? config.color : ""}`} />
                                                    <p className="text-xs font-semibold">{config.label}</p>
                                                    {isSelected && (
                                                        <motion.div
                                                            layoutId="statusIndicator"
                                                            className="absolute inset-0 rounded-xl border-2 border-current"
                                                        />
                                                    )}
                                                </motion.button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={onClose}
                                    className="px-5 py-2.5 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleSubmit}
                                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-blue-500/30 transition-all"
                                >
                                    {room ? "Update" : "Add new"}
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AddRoomModal;
