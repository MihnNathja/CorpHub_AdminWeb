import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useRooms } from "../../room/hooks/useRooms";

const AddAssetModal = ({ isOpen, onClose, asset, categories, onSubmit }) => {
    if (!isOpen) return null;

    const [isSaving, setIsSaving] = useState(false);
    const { rooms, loading: roomLoading } = useRooms();

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
    }, [asset]);

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

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-[500px] p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
                >
                    <X />
                </button>

                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
                    {asset ? "Edit Asset" : "Add New Asset"}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="mt-1 w-full border rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white"
                        />
                    </div>

                    {/* Code */}
                    <div>
                        <label className="block text-sm font-medium">Code</label>
                        <input
                            type="text"
                            name="code"
                            value={form.code}
                            onChange={handleChange}
                            required
                            className="mt-1 w-full border rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium">Category</label>
                        <select
                            name="categoryId"
                            value={form.categoryId}
                            onChange={handleChange}
                            className="mt-1 w-full border rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white"
                        >
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* ✅ Room */}
                    <div>
                        <label className="block text-sm font-medium">Room</label>
                        <select
                            name="roomId"
                            value={form.roomId}
                            onChange={handleChange}
                            className="mt-1 w-full border rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white"
                        >
                            <option value="">Select Room</option>
                            {roomLoading ? (
                                <option disabled>Loading rooms...</option>
                            ) : (
                                rooms.map((room) => (
                                    <option key={room.id} value={room.id}>
                                        {room.name}
                                    </option>
                                ))
                            )}
                        </select>
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium">Status</label>
                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            className="mt-1 w-full border rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white"
                        >
                            <option value="USABLE">USABLE</option>
                            <option value="BROKEN">BROKEN</option>
                            <option value="MAINTENANCE">MAINTENANCE</option>
                            <option value="DISPOSED">DISPOSED</option>
                        </select>
                    </div>

                    {/* Value */}
                    <div>
                        <label className="block text-sm font-medium">Value (₫)</label>
                        <input
                            type="number"
                            name="value"
                            value={form.value}
                            onChange={handleChange}
                            step="0.01"
                            className="mt-1 w-full border rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white"
                        />
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium">Purchase Date</label>
                            <input
                                type="date"
                                name="purchaseDate"
                                value={form.purchaseDate}
                                onChange={handleChange}
                                className="mt-1 w-full border rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Warranty</label>
                            <input
                                type="date"
                                name="warranty"
                                value={form.warranty}
                                onChange={handleChange}
                                className="mt-1 w-full border rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className={`px-4 py-2 rounded-lg text-white ${isSaving ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"}`}
                        >
                            {isSaving ? "Saving..." : asset ? "Save Changes" : "Add Asset"}
                        </button>

                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddAssetModal;
