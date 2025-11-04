import React, { useState } from "react";
import FloatingButton from "../../global/components/FloatingButton";
import Pagination from "../../global/components/Pagination";
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/outline";
import AssetModal from "../components/AssetModal";
import AddAssetModal from "../components/AddAssetModal";
import { useAssets } from "../hooks/useAssets";
import ConfirmDialog from "../../global/components/ConfirmDialog";
import { Filter, Search } from "lucide-react";

const AssetPage = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingAsset, setEditingAsset] = useState(null);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const {
        assets,
        categories,
        loading,
        error,
        page,
        size,
        totalPages,
        keywords,
        setKeywords,
        filters,
        clearFilters,
        updateFilters,
        setPage,
        selectedAsset,
        setSelectedAsset,
        addAsset,
        editAsset,
        removeAsset,
    } = useAssets();

    const handleFilterChange = (name, value) => {
        updateFilters({ [name]: value });
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl shadow-inner p-6 relative">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                Asset Management
            </h2>

            {/* 🔹 Floating Button */}
            <FloatingButton
                onClick={() => setIsAddModalOpen(true)}
                icon={PlusIcon}
                tooltip="New Asset"
                color="blue"
            />

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 mb-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    {/* Search bar */}
                    <div className="relative w-full sm:w-1/3">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={keywords}
                            onChange={(e) => setKeywords(e.target.value)}
                            placeholder="Search room name..."
                            className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />
                    </div>

                    {/* Bộ lọc dropdown */}
                    <div className="flex flex-wrap items-center gap-2 sm:justify-end w-full sm:w-auto">
                        {/* Category */}
                        <select
                            name="categoryId"
                            value={filters.categoryId}
                            onChange={(e) => handleFilterChange("categoryId", e.target.value)}
                            className="w-full sm:w-auto max-w-[180px] h-[40px] px-3 py-2 text-sm rounded-lg border 
               border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white 
               focus:ring-2 focus:ring-blue-400 focus:outline-none truncate"
                        >
                            <option value="">All categories</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            ))}
                        </select>

                        {/* Status */}
                        <select
                            name="status"
                            value={filters.status}
                            onChange={(e) => handleFilterChange("status", e.target.value)}
                            className="w-full sm:w-auto max-w-[160px] h-[40px] px-3 py-2 text-sm rounded-lg border 
               border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white 
               focus:ring-2 focus:ring-blue-400 focus:outline-none truncate"
                        >
                            <option value="">All status</option>
                            <option value="USABLE">Usable</option>
                            <option value="DISPOSED">Disposed</option>
                            <option value="BROKEN">Broken</option>
                            <option value="MAINTENANCE">Maintenance</option>
                        </select>

                        {/* Clear */}
                        <button
                            onClick={clearFilters}
                            className="w-full sm:w-auto max-w-[110px] h-[40px] flex items-center justify-center gap-1 
               text-sm rounded-lg border border-gray-300 dark:border-gray-600 
               text-gray-700 dark:text-gray-300 
               hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        >
                            <Filter className="w-4 h-4" />
                            Clear
                        </button>
                    </div>
                </div>
            </div>

            {/* 🔹 Bảng tài sản */}
            {assets?.length > 0 ? (
                <div className="overflow-x-auto mt-4 rounded-lg shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-100 dark:bg-gray-800">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">#</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Name</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Code</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Category</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Status</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Value</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Room</th>
                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-200">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
                            {assets.map((asset, index) => (
                                <tr
                                    key={asset.id}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-300">{size * page + index + 1}</td>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-800 dark:text-gray-100">
                                        {asset.name}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{asset.code}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                        {asset.category?.name || "N/A"}
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-semibold ${asset.status === "AVAILABLE"
                                                ? "bg-green-100 text-green-700"
                                                : asset.status === "IN_USE"
                                                    ? "bg-blue-100 text-blue-700"
                                                    : asset.status === "BROKEN"
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-yellow-100 text-yellow-700"
                                                }`}
                                        >
                                            {asset.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                        {asset.value ? `${asset.value.toLocaleString()} ₫` : "-"}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                        {asset.roomName || "Unassigned"}
                                    </td>
                                    <td className="px-4 py-3 text-center flex justify-center gap-2">
                                        <button
                                            onClick={() => {
                                                setSelectedAsset(asset);
                                                setIsModalOpen(true);
                                            }}
                                            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                            title="View details"
                                        >
                                            <EyeIcon className="w-5 h-5 text-blue-500" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setEditingAsset(asset);
                                                setIsAddModalOpen(true);
                                            }}
                                            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                            title="Edit asset"
                                        >
                                            <PencilIcon className="w-5 h-5 text-yellow-500" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsConfirmDialogOpen(true);
                                                setSelectedAsset(asset);
                                            }}
                                            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                            title="Delete asset"
                                        >
                                            <TrashIcon className="w-5 h-5 text-red-500" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 mt-10">
                    Không tìm thấy tài sản
                </p>
            )}

            {/* 🔹 Phân trang */}
            <div className="mt-4">
                <Pagination page={page} setPage={setPage} totalPages={totalPages} />
            </div>

            {/* 🔹 Modal chi tiết */}
            {isModalOpen && (
                <AssetModal
                    asset={selectedAsset}
                    onClose={() => { setSelectedAsset(null); setIsModalOpen(false); }}
                    onEdit={(asset) => {
                        setEditingAsset(asset);
                        setIsAddModalOpen(true);
                        setSelectedAsset(null);
                    }}
                    onRemove={() => {
                        setIsConfirmDialogOpen(true);
                    }}
                />
            )}

            {/* 🔹 Modal thêm/sửa */}
            {isAddModalOpen && (
                <AddAssetModal
                    isOpen={isAddModalOpen}
                    onClose={() => {
                        setIsAddModalOpen(false);
                        setEditingAsset(null);
                    }}
                    asset={editingAsset}
                    categories={categories}
                    onSubmit={(formData) => {
                        if (editingAsset) editAsset(formData);
                        else addAsset(formData);

                    }}
                />
            )}

            {/* 🔹 Confirm Dialog */}
            {isConfirmDialogOpen && (
                <ConfirmDialog
                    open={isConfirmDialogOpen}
                    title="Confirm Deletion"
                    message={`Are you sure you want to delete the asset "${selectedAsset?.name}"?`}
                    onConfirm={() => {
                        removeAsset(selectedAsset.id);
                        setIsConfirmDialogOpen(false);
                    }}
                    onCancel={() => setIsConfirmDialogOpen(false)}
                />
            )}

        </div>
    );
};

export default AssetPage;
