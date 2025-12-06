import React, { useEffect, useState } from "react";
import { X, Package, Calendar, DollarSign, Tag, Home, Zap, Loader } from "lucide-react";
import { useRooms } from "../../room/hooks/useRooms";
import SearchableSelect from "../../global/components/SearchableSelect";

const statusStyles = {
    USABLE: {
        bg: "bg-emerald-50 dark:bg-emerald-900/20",
        border: "border-emerald-200 dark:border-emerald-800",
        text: "text-emerald-700 dark:text-emerald-300",
    },
    BROKEN: {
        bg: "bg-rose-50 dark:bg-rose-900/20",
        border: "border-rose-200 dark:border-rose-800",
        text: "text-rose-700 dark:text-rose-300",
    },
    MAINTENANCE: {
        bg: "bg-amber-50 dark:bg-amber-900/20",
        border: "border-amber-200 dark:border-amber-800",
        text: "text-amber-700 dark:text-amber-300",
    },
    DISPOSED: {
        bg: "bg-gray-50 dark:bg-gray-900/20",
        border: "border-gray-200 dark:border-gray-800",
        text: "text-gray-700 dark:text-gray-300",
    },
};

const AddAssetModal = ({ isOpen, onClose, asset, categories, onSubmit }) => {
    if (!isOpen) return null;

    const [isSaving, setIsSaving] = useState(false);
    const { rooms, keywords, setKeywords, loading: roomLoading } = useRooms();

    const [form, setForm] = useState({
        id: "",
        name: "",
        code: "",
        status: "USABLE",
        value: "",
        categoryId: "",
        roomId: "",
        purchaseDate: "",
        warranty: "",
    });

    // ✅ Khi mở modal edit → set lại form
    useEffect(() => {
        if (asset) {
            setForm({
                id: asset.id || "",
                name: asset.name || "",
                code: asset.code || "",
                status: asset.status || "USABLE",
                value: asset.value || "",
                categoryId: asset.category?.id || "",
                roomId: asset.roomId || "",
                purchaseDate: asset.purchaseDate || "",
                warranty: asset.warranty || "",
            });
        } else {
            setForm({
                id: "",
                name: "",
                code: "",
                status: "USABLE",
                value: "",
                categoryId: "",
                roomId: "",
                purchaseDate: "",
                warranty: "",
            });
        }
    }, [asset, isOpen]);

    // ✅ Cập nhật form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // ✅ Gửi form về parent
    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            id: form.id || null,
            name: form.name,
            code: form.code,
            status: form.status,
            value: form.value ? parseFloat(form.value) : null,
            categoryId: form.categoryId || null,
            roomId: form.roomId || null,
            purchaseDate: form.purchaseDate || null,
            warranty: form.warranty || null,
        };
        setIsSaving(true);
        await onSubmit(payload);
        setIsSaving(false);

        onClose();
    };

    const isEditing = !!asset;
    const statusConfig = statusStyles[form.status] || statusStyles.USABLE;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-800">
                {/* Header */}
                <div className="sticky top-0 px-8 py-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-lg bg-blue-600 dark:bg-blue-600 text-white">
                            <Package className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                {isEditing ? "Edit Asset" : "Add New Asset"}
                            </h2>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                {isEditing ? "Update asset information" : "Create a new asset entry"}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-600 dark:text-gray-400"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Tag className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            Basic Information
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Asset Name <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g., Desk Lamp"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                />
                            </div>

                            {/* Code */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Asset Code <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="code"
                                    value={form.code}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g., ASSET-001"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                />
                            </div>
                        </div>

                        {/* Category & Status */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Category */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Category
                                </label>
                                <select
                                    name="categoryId"
                                    value={form.categoryId}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={form.status}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${statusConfig.border}`}
                                >
                                    <option value="USABLE">Usable</option>
                                    <option value="BROKEN">Broken</option>
                                    <option value="MAINTENANCE">Maintenance</option>
                                    <option value="DISPOSED">Disposed</option>
                                </select>

                                {/* Status Preview */}
                                <div className={`mt-2 px-3 py-1.5 rounded-lg text-xs font-semibold border inline-block ${statusConfig.bg} ${statusConfig.border} ${statusConfig.text}`}>
                                    {form.status}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Location & Value */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Home className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            Location & Value
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Room */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Room Location
                                </label>
                                <SearchableSelect
                                    items={rooms}
                                    value={form.roomId}
                                    onChange={(id) => setForm((prev) => ({ ...prev, roomId: id }))}
                                    keywords={keywords}
                                    onKeyWordsChange={setKeywords}
                                    loading={roomLoading}
                                    placeholder="Search for a room..."
                                />
                            </div>

                            {/* Value */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Asset Value
                                </label>
                                <div className="relative">
                                    <DollarSign className="absolute left-4 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                                    <input
                                        type="number"
                                        name="value"
                                        value={form.value}
                                        onChange={handleChange}
                                        step="0.01"
                                        placeholder="0.00"
                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            Important Dates
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Purchase Date */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Purchase Date
                                </label>
                                <input
                                    type="date"
                                    name="purchaseDate"
                                    value={form.purchaseDate}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                />
                            </div>

                            {/* Warranty */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Warranty Expiration
                                </label>
                                <input
                                    type="date"
                                    name="warranty"
                                    value={form.warranty}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-800">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-semibold transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className={`px-6 py-2.5 rounded-lg text-white text-sm font-semibold flex items-center gap-2 transition-all ${isSaving
                                    ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 active:scale-95"
                                }`}
                        >
                            {isSaving && <Loader className="w-4 h-4 animate-spin" />}
                            {isSaving ? "Saving..." : isEditing ? "Save Changes" : "Add Asset"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddAssetModal;
