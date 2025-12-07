import { Calendar, Workflow, Tag, Clock, Edit3, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function TemplateDetail({ template, onEdit, onDelete }) {
    if (!template) return null;

    const entityColors = {
        ASSET: {
            bg: "bg-blue-50 dark:bg-blue-900/20",
            text: "text-blue-700 dark:text-blue-300",
            border: "border-blue-200 dark:border-blue-800",
        },
        ROOM: {
            bg: "bg-emerald-50 dark:bg-emerald-900/20",
            text: "text-emerald-700 dark:text-emerald-300",
            border: "border-emerald-200 dark:border-emerald-800",
        },
        EMPLOYEE: {
            bg: "bg-purple-50 dark:bg-purple-900/20",
            text: "text-purple-700 dark:text-purple-300",
            border: "border-purple-200 dark:border-purple-800",
        },
        DEFAULT: {
            bg: "bg-gray-50 dark:bg-gray-900/20",
            text: "text-gray-700 dark:text-gray-300",
            border: "border-gray-200 dark:border-gray-800",
        },
    };

    const entityConfig = entityColors[template.targetEntity?.toUpperCase()] || entityColors.DEFAULT;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {/* Header Section */}
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg">
                            <Workflow className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 break-words">
                                {template.name}
                            </h1>

                            {/* Entity Badge */}
                            <div className="inline-flex items-center gap-2">
                                <span className={`
                                    px-3 py-1.5 rounded-lg text-xs font-semibold border
                                    ${entityConfig.bg} ${entityConfig.text} ${entityConfig.border}
                                `}>
                                    <Tag className="w-3 h-3 inline-block mr-1" />
                                    {template.targetEntity}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                        {onEdit && (
                            <button
                                onClick={() => onEdit(template)}
                                className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                title="Edit template"
                            >
                                <Edit3 className="w-4 h-4" />
                            </button>
                        )}
                        {onDelete && (
                            <button
                                onClick={() => onDelete(template.id)}
                                className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                                title="Delete template"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Description Section */}
            {template.description && (
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {template.description}
                    </p>
                </div>
            )}

            {/* Metadata Section */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Created Date */}
                    <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                            <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                                Created
                            </p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">
                                {template.createdAt
                                    ? dayjs(template.createdAt).format("MMM D, YYYY")
                                    : "N/A"
                                }
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                {template.createdAt
                                    ? dayjs(template.createdAt).fromNow()
                                    : ""
                                }
                            </p>
                        </div>
                    </div>

                    {/* Updated Date */}
                    <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                            <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                                Last Updated
                            </p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">
                                {template.updatedAt
                                    ? dayjs(template.updatedAt).format("MMM D, YYYY")
                                    : "N/A"
                                }
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                {template.updatedAt
                                    ? dayjs(template.updatedAt).fromNow()
                                    : ""
                                }
                            </p>
                        </div>
                    </div>
                </div>

                {/* Template ID */}
                {template.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                                Template ID
                            </p>
                            <p className="text-xs font-mono text-gray-500 dark:text-gray-400">
                                {template.id.slice(0, 16)}...
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
