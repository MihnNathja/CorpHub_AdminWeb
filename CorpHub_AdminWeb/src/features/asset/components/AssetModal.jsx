import React from "react";
import { X, Edit3, Trash2, Calendar, Tag, DollarSign, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AssetModal = ({ asset, onClose, onEdit, onRemove }) => {
  if (!asset) return null;

  const statusColor = {
    USABLE: "bg-green-100 text-green-700 border-green-300",
    BROKEN: "bg-red-100 text-red-700 border-red-300",
    MAINTENANCE: "bg-yellow-100 text-yellow-700 border-yellow-300",
    DISPOSED: "bg-gray-200 text-gray-700 border-gray-300",
  }[asset.status] || "bg-gray-100 text-gray-700 border-gray-300";

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-[500px] max-w-[90%] p-6 relative border border-gray-200 dark:border-gray-700"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <h3 className="text-xl font-semibold mb-5 text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <Tag className="w-5 h-5 text-blue-500" /> Asset Details
          </h3>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm text-gray-700 dark:text-gray-300">
            <p className="font-medium">Name:</p>
            <p className="truncate">{asset.name}</p>

            <p className="font-medium">Code:</p>
            <p className="truncate">{asset.code}</p>

            <p className="font-medium">Category:</p>
            <p>{asset.category?.name || "N/A"}</p>

            <p className="font-medium">Status:</p>
            <span
              className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full border ${statusColor}`}
            >
              {asset.status}
            </span>

            <p className="font-medium flex items-center gap-1">
              <DollarSign className="w-4 h-4" /> Value:
            </p>
            <p>{asset.value ? `${asset.value.toLocaleString()} ₫` : "N/A"}</p>

            <p className="font-medium flex items-center gap-1">
              <Calendar className="w-4 h-4" /> Purchase:
            </p>
            <p>{asset.purchaseDate || "N/A"}</p>

            <p className="font-medium flex items-center gap-1">
              <Calendar className="w-4 h-4" /> Warranty:
            </p>
            <p>{asset.warranty || "N/A"}</p>

            <p className="font-medium flex items-center gap-1">
              <MapPin className="w-4 h-4" /> Room:
            </p>
            <p>{asset.roomName || "Unassigned"}</p>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end mt-8 gap-3">
            <button
              onClick={() => onEdit(asset)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-sm transition"
            >
              <Edit3 size={16} /> Edit
            </button>
            <button
              onClick={() => onRemove()}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-sm transition"
            >
              <Trash2 size={16} /> Delete
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AssetModal;
