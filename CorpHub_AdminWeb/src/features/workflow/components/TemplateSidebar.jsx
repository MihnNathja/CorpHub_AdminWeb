import { PlusCircle, RefreshCcw, Workflow, Loader, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TemplateSidebar({
    templates,
    loading,
    selectedId,
    onSelect,
    onRefresh,
}) {
    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-indigo-600 dark:bg-indigo-600 text-white">
                            <Workflow className="w-4 h-4" />
                        </div>
                        <h2 className="text-base font-bold text-gray-900 dark:text-white">
                            Templates
                        </h2>
                    </div>
                    <motion.button
                        whileHover={{ rotate: 180 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        onClick={onRefresh}
                        className="p-2 rounded-lg hover:bg-white dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
                        title="Refresh templates"
                    >
                        <RefreshCcw className="w-4 h-4" />
                    </motion.button>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                    {templates.length} template(s) available
                </p>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-3">
                        <Loader className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-spin" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Loading templates...
                        </p>
                    </div>
                ) : templates.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-3 text-center">
                        <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-800">
                            <Workflow className="w-8 h-8 text-gray-400 dark:text-gray-600" />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-700 dark:text-gray-300 text-sm">
                                No templates yet
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Create your first workflow
                            </p>
                        </div>
                    </div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        {templates.map((t, idx) => {
                            const isSelected = selectedId === t.id;

                            return (
                                <motion.div
                                    key={t.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ delay: idx * 0.05 }}
                                    layout
                                >
                                    <motion.div
                                        onClick={() => onSelect(t.id)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`
                                            p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                                            ${isSelected
                                                ? "bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/30 border-indigo-300 dark:border-indigo-700 shadow-md"
                                                : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-sm"
                                            }
                                        `}
                                    >
                                        {/* Selected Indicator */}
                                        {isSelected && (
                                            <div className="absolute top-2 right-2">
                                                <div className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse" />
                                            </div>
                                        )}

                                        <div className="flex items-start gap-3">
                                            <div className={`
                                                p-2 rounded-lg flex-shrink-0
                                                ${isSelected
                                                    ? "bg-indigo-100 dark:bg-indigo-900/50"
                                                    : "bg-gray-100 dark:bg-gray-700"
                                                }
                                            `}>
                                                <Zap className={`w-4 h-4 ${isSelected
                                                        ? "text-indigo-600 dark:text-indigo-400"
                                                        : "text-gray-600 dark:text-gray-400"
                                                    }`} />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <p className={`
                                                    font-semibold text-sm truncate
                                                    ${isSelected
                                                        ? "text-indigo-900 dark:text-indigo-100"
                                                        : "text-gray-900 dark:text-white"
                                                    }
                                                `}>
                                                    {t.name}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className={`
                                                        text-xs px-2 py-0.5 rounded-full font-medium
                                                        ${isSelected
                                                            ? "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300"
                                                            : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                                                        }
                                                    `}>
                                                        {t.targetEntity}
                                                    </span>
                                                </div>
                                                {t.description && (
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                                                        {t.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4
                        bg-gradient-to-r from-indigo-600 to-blue-600 
                        hover:from-indigo-700 hover:to-blue-700
                        text-white rounded-xl font-semibold text-sm
                        shadow-lg shadow-indigo-500/30 
                        transition-all duration-200"
                >
                    <PlusCircle className="w-4 h-4" />
                    New Template
                </motion.button>
            </div>
        </div>
    );
}
