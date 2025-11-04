import React, { useState } from "react";
import { X, Search, Package, Loader2, ArrowRight } from "lucide-react";
import { useAssets } from "../hooks/useAssets";
import axios from "axios";
import { showError, showSuccess } from "../../../utils/toastUtils";

const AssetSidePanel = ({ roomId, existedAssetIds, onClose, onAssignAssets }) => {
    const [loading, setLoading] = useState(false);
    const [selectedAssets, setSelectedAssets] = useState([]); // 🔹 danh sách đã chọn
    const [moving, setMoving] = useState(false); // trạng thái khi gọi API

    const { assets, keywords, setKeywords } = useAssets();

    const availableAssets = assets.filter(
        (asset) => !existedAssetIds?.includes(asset.id)
    );


    // 🟦 Chọn / Bỏ chọn asset
    const toggleSelect = (asset) => {
        setSelectedAssets((prev) => {
            const exists = prev.find((a) => a.id === asset.id);
            return exists
                ? prev.filter((a) => a.id !== asset.id)
                : [...prev, asset];
        });
    };

    const handleMove = async () => {
        if (selectedAssets.length === 0) return;
        try {
            setMoving(true);

            const payload = {
                roomId,
                assetIds: selectedAssets.map((a) => a.id),
            };

            await onAssignAssets?.(payload);
            setSelectedAssets([]);

        } catch (err) {
            console.error(err);
            showError(err || "Có lỗi khi chuyển tài sản.");
        } finally {
            setMoving(false);
        }
    };

    return (
        <div
            className="w-[360px] sm:w-[400px] border-l border-gray-300 dark:border-gray-700 
           bg-white dark:bg-gray-900 flex flex-col animate-slideIn shadow-xl"
        >
            {/* 🔹 Header */}
            <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 shadow-sm sticky top-0 z-10">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                    <Package className="w-5 h-5 text-blue-500" />
                    Thêm tài sản vào phòng
                </h3>
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-red-500 transition"
                    title="Đóng"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* 🔍 Ô tìm kiếm */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                        placeholder="Tìm kiếm tài sản..."
                        className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
             bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white 
             focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none 
             transition placeholder-gray-400"
                    />
                </div>
            </div>

            {/* 🔸 Danh sách chip đã chọn */}
            {selectedAssets.length > 0 && (
                <div
                    className="px-4 pt-3 pb-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                >
                    {/* vùng chứa chip */}
                    <div
                        className="flex flex-wrap gap-2 max-h-24 overflow-y-auto pr-1 custom-scroll"
                    >
                        {selectedAssets.map((asset) => (
                            <span
                                key={asset.id}
                                className="flex items-center gap-1 px-2 py-1 text-sm bg-blue-100 text-blue-700 
                   dark:bg-blue-900/40 dark:text-blue-300 rounded-full"
                            >
                                {asset.name}
                                <button
                                    onClick={() =>
                                        setSelectedAssets((prev) => prev.filter((a) => a.id !== asset.id))
                                    }
                                    className="hover:text-red-500"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </span>
                        ))}
                    </div>

                    {/* Move Button */}
                    <div className="flex justify-end mt-3">
                        <button
                            onClick={handleMove}
                            disabled={moving}
                            className="flex items-center gap-1 px-3 py-1 text-sm rounded-md 
                   bg-blue-600 hover:bg-blue-700 text-white shadow-sm 
                   disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            {moving ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" /> Moving...
                                </>
                            ) : (
                                <>
                                    <ArrowRight className="w-4 h-4" /> Move
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}


            {/* 📦 Danh sách tài sản */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {loading ? (
                    <div className="flex justify-center items-center h-32 text-gray-500 dark:text-gray-400">
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Đang tải danh sách...
                    </div>
                ) : availableAssets.length > 0 ? (
                    availableAssets.map((asset) => {
                        const isSelected = selectedAssets.some((a) => a.id === asset.id);
                        return (
                            <div
                                key={asset.id}
                                onClick={() => toggleSelect(asset)}
                                className={`p-3 border rounded-lg cursor-pointer flex items-start gap-3 group transition
                ${isSelected
                                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                                        : "border-gray-200 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                                    }`}
                            >
                                <div
                                    className={`p-2 rounded-md ${isSelected
                                        ? "bg-blue-500 text-white"
                                        : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 group-hover:bg-blue-500 group-hover:text-white"
                                        } transition`}
                                >
                                    <Package className="w-4 h-4" />
                                </div>

                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-gray-800 dark:text-gray-100 group-hover:text-blue-700 dark:group-hover:text-blue-300">
                                        {asset.name}
                                    </span>
                                    {asset.category && (
                                        <span className="text-xs text-gray-500 dark:text-gray-400 italic">
                                            {asset.category.name || asset.category}
                                        </span>
                                    )}
                                    {asset.roomName && (
                                        <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="w-3.5 h-3.5 text-indigo-400"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M3 21v-4a1 1 0 011-1h3V5a1 1 0 011-1h8a1 1 0 011 1v11h3a1 1 0 011 1v4M9 9h6m-6 3h6"
                                                />
                                            </svg>
                                            {asset.roomName}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                        Không có tài sản nào phù hợp.
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
                Chọn một hoặc nhiều tài sản để thêm vào phòng.
            </div>
        </div>
    );
};

export default AssetSidePanel;
