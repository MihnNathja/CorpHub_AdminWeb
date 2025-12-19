// src/features/document/components/DocumentDeleteDialog.jsx
import { useEffect } from "react";
import { Loader2, AlertCircle, FileText, X, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DocumentDeleteDialog({
  open,
  onClose,
  document,
  checkRelation,
  relationInfo,
  checking,
  deleting,
  onDelete,
}) {
  useEffect(() => {
    if (open && document) checkRelation(document.id);
  }, [open, document]);

  return (
    <AnimatePresence>
      {open && document && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: -10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative"
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 text-red-600 p-2 rounded-xl">
                <FileText size={20} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Delete document
                </h2>
                <p className="text-sm text-gray-500 truncate max-w-[250px]">
                  {document?.title || "Untitled"}
                </p>
              </div>
            </div>

            {/* Nội dung */}
            <div className="py-3 px-1 min-h-[60px] flex items-center justify-center">
              {checking ? (
                <div className="flex flex-col items-center text-gray-500 py-4">
                  <Loader2 size={22} className="animate-spin mb-2" />
                  <span>Checking relations...</span>
                </div>
              ) : relationInfo?.hasRelations ? (
                <div className="w-full bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-red-700 mb-1">
                    <AlertCircle size={18} />
                    <span className="font-medium">
                      Cannot delete — this document is used in:
                    </span>
                  </div>
                  <div className="max-h-[150px] overflow-y-auto">
                    <ul className="list-disc list-inside text-sm text-red-700 ml-4 space-y-1">
                      {relationInfo.relatedCompetencies.map((r) => (
                        <li key={r.id}>{r.name}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center text-gray-600 text-sm text-center py-3">
                  <CheckCircle2 size={22} className="text-green-500 mb-2" />
                  <p>
                    This document is not linked to any competency.
                    <br />
                    It is safe to delete.
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={onClose}
                disabled={deleting}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-1"
              >
                <X size={14} /> Cancel
              </button>

              {!checking && !relationInfo?.hasRelations && (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onDelete(document.id)}
                  disabled={deleting}
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition-all disabled:opacity-60 flex items-center gap-2"
                >
                  {deleting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <AlertCircle size={16} />
                      Delete document
                    </>
                  )}
                </motion.button>
              )}
            </div>

            {/* Nút đóng */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={18} />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
