import React, { useState } from "react";
import FloatingButton from "../../global/components/FloatingButton";
import Pagination from "../../global/components/Pagination";
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/outline";
import AssetModal from "../components/AssetModal";
import AddAssetModal from "../components/AddAssetModal";
import { useAssets } from "../hooks/useAssets";
import ConfirmDialog from "../../global/components/ConfirmDialog";
import { Filter, Search, Package, Zap } from "lucide-react";

const statusStyles = {
    USABLE: {
        bg: "bg-emerald-100 dark:bg-emerald-900/30",
        text: "text-emerald-700 dark:text-emerald-300",
        border: "border-emerald-200 dark:border-emerald-800",
        dot: "bg-emerald-500",
    },
    BROKEN: {
        bg: "bg-rose-100 dark:bg-rose-900/30",
        text: "text-rose-700 dark:text-rose-300",
        border: "border-rose-200 dark:border-rose-800",
        dot: "bg-rose-500",
    },
    MAINTENANCE: {
        bg: "bg-amber-100 dark:bg-amber-900/30",
        text: "text-amber-700 dark:text-amber-300",
        border: "border-amber-200 dark:border-amber-800",
        dot: "bg-amber-500",
    },
    DISPOSED: {
        bg: "bg-gray-100 dark:bg-gray-800",
        text: "text-gray-700 dark:text-gray-300",
        border: "border-gray-200 dark:border-gray-700",
        dot: "bg-gray-500",
    },
};

const AssetPage = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingAsset, setEditingAsset] = useState(null);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const {
        assets,
        categories,
        meta,
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
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl p-8 shadow-lg border border-white/10">
                <div className="flex items-center gap-4 mb-3">
                    <div className="p-3 rounded-xl bg-white/15 backdrop-blur-sm">
                        <Package className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-white/80 uppercase tracking-wide">Inventory</p>
                        <h1 className="text-3xl font-bold">Asset Management</h1>
                    </div>
                </div>
                <p className="text-sm text-white/70 ml-16">
                    Track and manage all organizational assets and equipment
                </p>
            </div>

            {/* Floating Button */}
            <FloatingButton
                onClick={() => {
                    setEditingAsset(null);
                    setIsAddModalOpen(true);
                }}
                icon={PlusIcon}
                tooltip="Add New Asset"
                color="blue"
            />

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border border-indigo-200 dark:border-indigo-800 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                            Total Assets
                        </p>
                        <Package className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {meta.totalElements || 0}
                    </p>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                            Usable
                        </p>
                        <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {meta.assetCounts?.USABLE || 0}
                    </p>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                            Disposed
                        </p>
                        <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {meta.assetCounts?.DISPOSED || 0}
                    </p>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-br from-rose-50 to-orange-50 dark:from-rose-900/20 dark:to-orange-900/20 border border-rose-200 dark:border-rose-800 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                            Broken
                        </p>
                        <Zap className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {meta.assetCounts?.BROKEN || 0}
                    </p>
                </div>
            </div>

            {/* Filter Section */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 space-y-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Filter className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        Filters & Search
                    </h3>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search bar */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                        <input
                            type="text"
                            value={keywords}
                            onChange={(e) => setKeywords(e.target.value)}
                            placeholder="Search by name or code..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        />
                    </div>

                    {/* Category Filter */}
                    <select
                        name="categoryId"
                        value={filters.categoryId}
                        onChange={(e) => handleFilterChange("categoryId", e.target.value)}
                        className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white bg-white text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition min-w-max"
                    >
                        <option value="">All Categories</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>

                    {/* Status Filter */}
                    <select
                        name="status"
                        value={filters.status}
                        onChange={(e) => handleFilterChange("status", e.target.value)}
                        className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white bg-white text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition min-w-max"
                    >
                        <option value="">All Status</option>
                        <option value="USABLE">Usable</option>
                        <option value="BROKEN">Broken</option>
                        <option value="MAINTENANCE">Maintenance</option>
                        <option value="DISPOSED">Disposed</option>
                    </select>

                    {/* Clear Button */}
                    <button
                        onClick={clearFilters}
                        className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-semibold transition-colors flex items-center gap-2 whitespace-nowrap"
                    >
                        <Filter className="w-4 h-4" />
                        Clear
                    </button>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                {assets?.length > 0 ? (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700">
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">#</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Code</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Category</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Value</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Room</th>
                                        <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {assets.map((asset, index) => {
                                        const statusStyle = statusStyles[asset.status] || statusStyles.USABLE;

                                        return (
                                            <tr
                                                key={asset.id}
                                                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200"
                                            >
                                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 font-medium">
                                                    {size * page + index + 1}
                                                </td>
                                                <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                                                    {asset.name}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 font-mono">
                                                    {asset.code}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                                    {asset.category?.name || "N/A"}
                                                </td>
                                                <td className="px-6 py-4 text-sm">
                                                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${statusStyle.border} ${statusStyle.text} ${statusStyle.bg}`}>
                                                        <div className={`w-2 h-2 rounded-full ${statusStyle.dot}`} />
                                                        {asset.status}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 font-medium">
                                                    {asset.value ? `${asset.value.toLocaleString()} ₫` : "-"}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                                    <span className={`inline-block px-3 py-1.5 rounded-lg text-xs font-semibold ${asset.roomName
                                                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                                                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                                                        }`}>
                                                        {asset.roomName || "Unassigned"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedAsset(asset);
                                                                setIsModalOpen(true);
                                                            }}
                                                            className="p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 transition-colors"
                                                            title="View details"
                                                        >
                                                            <EyeIcon className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setEditingAsset(asset);
                                                                setIsAddModalOpen(true);
                                                            }}
                                                            className="p-2 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 text-amber-600 dark:text-amber-400 transition-colors"
                                                            title="Edit asset"
                                                        >
                                                            <PencilIcon className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setIsConfirmDialogOpen(true);
                                                                setSelectedAsset(asset);
                                                            }}
                                                            className="p-2 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/30 text-rose-600 dark:text-rose-400 transition-colors"
                                                            title="Delete asset"
                                                        >
                                                            <TrashIcon className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30">
                            <Pagination page={page} setPage={setPage} totalPages={totalPages} />
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center py-16 px-6">
                        <div className="text-center space-y-2">
                            <Package className="w-8 h-8 text-gray-300 dark:text-gray-700 mx-auto" />
                            <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                                No assets found
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                                Try adjusting your filters or add a new asset
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            {isModalOpen && (
                <AssetModal
                    asset={selectedAsset}
                    onClose={() => {
                        setSelectedAsset(null);
                        setIsModalOpen(false);
                    }}
                    onEdit={(asset) => {
                        setEditingAsset(asset);
                        setIsAddModalOpen(true);
                        setSelectedAsset(null);
                        setIsModalOpen(false);
                    }}
                    onRemove={() => {
                        setIsConfirmDialogOpen(true);
                    }}
                />
            )}

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

            {isConfirmDialogOpen && (
                <ConfirmDialog
                    open={isConfirmDialogOpen}
                    title="Delete Asset"
                    message={`Are you sure you want to delete "${selectedAsset?.name}"? This action cannot be undone.`}
                    confirmText="Delete"
                    cancelText="Cancel"
                    confirmColor="danger"
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
