import React from "react";
import {
  X,
  Edit3,
  Trash2,
  Calendar,
  Tag,
  DollarSign,
  MapPin,
  Package,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const statusStyles = {
  USABLE: {
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-200 dark:border-emerald-800",
    dot: "bg-emerald-500",
    icon: CheckCircle2,
    label: "Usable",
  },
  BROKEN: {
    bg: "bg-rose-50 dark:bg-rose-900/20",
    text: "text-rose-700 dark:text-rose-300",
    border: "border-rose-200 dark:border-rose-800",
    dot: "bg-rose-500",
    icon: AlertCircle,
    label: "Broken",
  },
  MAINTENANCE: {
    bg: "bg-amber-50 dark:bg-amber-900/20",
    text: "text-amber-700 dark:text-amber-300",
    border: "border-amber-200 dark:border-amber-800",
    dot: "bg-amber-500",
    icon: AlertCircle,
    label: "Maintenance",
  },
  DISPOSED: {
    bg: "bg-gray-50 dark:bg-gray-900/20",
    text: "text-gray-700 dark:text-gray-300",
    border: "border-gray-200 dark:border-gray-800",
    dot: "bg-gray-500",
    icon: AlertCircle,
    label: "Disposed",
  },
};

const AssetModal = ({ asset, onClose, onEdit, onRemove }) => {
  if (!asset) return null;

  const statusConfig = statusStyles[asset.status] || statusStyles.USABLE;
  const StatusIcon = statusConfig.icon;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Header */}
          <div className="px-8 py-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-blue-600 dark:bg-blue-600 text-white">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {asset.name}
                </h2>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-mono mt-1">
                  Code: {asset.code}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-600 dark:text-gray-400"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            {/* Status Badge */}
            <div className={`flex items-center gap-3 p-4 rounded-xl border ${statusConfig.border} ${statusConfig.bg}`}>
              <div className={`w-3 h-3 rounded-full ${statusConfig.dot}`} />
              <div className="flex-1">
                <p className={`text-sm font-semibold ${statusConfig.text}`}>
                  {statusConfig.label}
                </p>
                <p className={`text-xs ${statusConfig.text} opacity-75 mt-0.5`}>
                  Current Status
                </p>
              </div>
              <StatusIcon className={`w-5 h-5 ${statusConfig.text}`} />
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Category */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-2 mb-1">
                  <Tag className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    Category
                  </p>
                </div>
                <p className="text-base font-bold text-gray-900 dark:text-white mt-1">
                  {asset.category?.name || "N/A"}
                </p>
              </div>

              {/* Value */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    Value
                  </p>
                </div>
                <p className="text-base font-bold text-gray-900 dark:text-white mt-1">
                  {asset.value ? `${asset.value.toLocaleString()} ₫` : "N/A"}
                </p>
              </div>

              {/* Purchase Date */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    Purchase Date
                  </p>
                </div>
                <p className="text-base font-bold text-gray-900 dark:text-white mt-1">
                  {asset.purchaseDate || "N/A"}
                </p>
              </div>

              {/* Warranty */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border border-indigo-200 dark:border-indigo-800">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    Warranty
                  </p>
                </div>
                <p className="text-base font-bold text-gray-900 dark:text-white mt-1">
                  {asset.warranty || "N/A"}
                </p>
              </div>

              {/* Room Location */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-800 sm:col-span-2">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    Room Location
                  </p>
                </div>
                <p className="text-base font-bold text-gray-900 dark:text-white mt-1">
                  {asset.roomName ? (
                    <span className="inline-flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      {asset.roomName}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <AlertCircle className="w-4 h-4" />
                      Unassigned
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 space-y-2">
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Summary
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Asset ID:</span>
                <span className="font-mono font-semibold text-gray-900 dark:text-white">
                  {asset.id?.slice(0, 12)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Created:</span>
                <span className="text-gray-900 dark:text-white">
                  {asset.createdAt ? new Date(asset.createdAt).toLocaleDateString() : "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-8 py-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-semibold transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => onEdit(asset)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white text-sm font-semibold transition-colors shadow-md hover:shadow-lg"
            >
              <Edit3 className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={() => onRemove()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 dark:bg-rose-600 dark:hover:bg-rose-700 text-white text-sm font-semibold transition-colors shadow-md hover:shadow-lg"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AssetModal;
