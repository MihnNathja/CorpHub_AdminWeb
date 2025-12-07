import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, XCircle, AlertCircle, FileText } from 'lucide-react';

export default function ReasonDialog({
    open = false,
    onClose,
    onAction,
    isAcceptDialog = true,
    title = isAcceptDialog ? 'Xác nhận phê duyệt' : 'Xác nhận từ chối',
}) {
    const [reason, setReason] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        if (!isAcceptDialog && !reason.trim()) {
            setError('Vui lòng nhập lý do từ chối');
            return;
        }
        onAction(reason);
        setReason('');
        setError('');
    };

    const handleClose = () => {
        setReason('');
        setError('');
        onClose();
    };

    const config = isAcceptDialog
        ? {
            color: 'emerald',
            icon: CheckCircle,
            gradient: 'from-emerald-500 to-teal-500',
            bgGradient: 'from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20',
            borderColor: 'border-emerald-300 dark:border-emerald-700',
            buttonBg: 'from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700',
            buttonShadow: 'shadow-emerald-500/30',
        }
        : {
            color: 'red',
            icon: XCircle,
            gradient: 'from-red-500 to-rose-500',
            bgGradient: 'from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20',
            borderColor: 'border-red-300 dark:border-red-700',
            buttonBg: 'from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700',
            buttonShadow: 'shadow-red-500/30',
        };

    const Icon = config.icon;

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.2 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200 dark:border-gray-700"
                        >
                            {/* Header with gradient */}
                            <div className={`relative bg-gradient-to-r ${config.gradient} px-6 py-5 text-white`}>
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
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold">{title}</h2>
                                            <p className="text-xs text-white/80">
                                                {isAcceptDialog
                                                    ? 'Bạn có thể thêm ghi chú (tùy chọn)'
                                                    : 'Vui lòng nhập lý do từ chối'}
                                            </p>
                                        </div>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.1, rotate: 90 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={handleClose}
                                        className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </motion.button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                {/* Info box */}
                                {!isAcceptDialog && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`mb-4 p-4 rounded-xl bg-gradient-to-r ${config.bgGradient} border-2 ${config.borderColor}`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <AlertCircle className={`w-5 h-5 text-${config.color}-600 dark:text-${config.color}-400 flex-shrink-0 mt-0.5`} />
                                            <div>
                                                <p className={`text-sm font-semibold text-${config.color}-800 dark:text-${config.color}-300`}>
                                                    Yêu cầu lý do
                                                </p>
                                                <p className={`text-xs text-${config.color}-700 dark:text-${config.color}-400 mt-1`}>
                                                    Vui lòng cung cấp lý do rõ ràng để người yêu cầu hiểu tại sao bị từ chối
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Textarea */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                        {isAcceptDialog ? 'Ghi chú (tùy chọn)' : 'Lý do từ chối'}
                                        {!isAcceptDialog && <span className="text-red-500">*</span>}
                                    </label>
                                    <textarea
                                        value={reason}
                                        onChange={(e) => {
                                            setReason(e.target.value);
                                            setError('');
                                        }}
                                        rows={5}
                                        placeholder={
                                            isAcceptDialog
                                                ? 'Nhập ghi chú nếu cần...'
                                                : 'Nhập lý do từ chối...'
                                        }
                                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all resize-none
                                            ${error
                                                ? 'border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/20'
                                                : 'border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20'
                                            }
                                            bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                                            placeholder:text-gray-400 dark:placeholder:text-gray-500
                                            focus:outline-none`}
                                    />
                                    {error && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-xs text-red-600 dark:text-red-400 mt-2 flex items-center gap-1"
                                        >
                                            <AlertCircle className="w-3 h-3" />
                                            {error}
                                        </motion.p>
                                    )}
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                        {reason.length} / 500 ký tự
                                    </p>
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="button"
                                    onClick={handleClose}
                                    className="px-5 py-2.5 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                    Hủy bỏ
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="button"
                                    onClick={handleSubmit}
                                    className={`px-5 py-2.5 rounded-xl bg-gradient-to-r ${config.buttonBg} text-white font-semibold shadow-lg ${config.buttonShadow} transition-all flex items-center gap-2`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {isAcceptDialog ? 'Phê duyệt' : 'Từ chối'}
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}