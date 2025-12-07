import { GripVertical, Edit3, Trash2, User, Shield, Briefcase, Building2, Zap, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const APPROVER_CONFIG = {
    USER: {
        icon: User,
        label: "User",
        color: "blue",
        render: (params) => `User ID: ${params.userId}`,
    },
    ROLE: {
        icon: Shield,
        label: "Role",
        color: "purple",
        render: (params) => params.roleName || "N/A",
    },
    POSITION: {
        icon: Briefcase,
        label: "Position",
        color: "emerald",
        render: (params) => params.code || "N/A",
    },
    POSITION_LEVEL: {
        icon: Briefcase,
        label: "Position Level",
        color: "amber",
        render: (params) => `Level ${params.levelOrder}`,
    },
    DEPARTMENT: {
        icon: Building2,
        label: "Department",
        color: "indigo",
        render: (params) => params.role || "N/A",
    },
};

const STEP_TYPE_CONFIG = {
    APPROVAL: {
        icon: CheckCircle2,
        color: "emerald",
        label: "Approval",
    },
    NOTIFICATION: {
        icon: Zap,
        color: "blue",
        label: "Notification",
    },
    DEFAULT: {
        icon: Zap,
        color: "gray",
        label: "Unknown",
    },
};

function renderApprover(step) {
    if (!step?.approver) return null;

    const { type, params } = step.approver;
    const config = APPROVER_CONFIG[type];

    if (!config) {
        return (
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <User className="w-3 h-3" />
                <span>{type} — {JSON.stringify(params)}</span>
            </div>
        );
    }

    const Icon = config.icon;
    const colorClasses = {
        blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
        purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800",
        emerald: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
        amber: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
        indigo: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
    };

    return (
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold ${colorClasses[config.color]}`}>
            <Icon className="w-3.5 h-3.5" />
            <span>{config.label}:</span>
            <span className="font-bold">{config.render(params)}</span>
        </div>
    );
}

export default function StepCard({ step, onEdit, onDelete, isDragging }) {
    const stepTypeConfig = STEP_TYPE_CONFIG[step.stepType] || STEP_TYPE_CONFIG.DEFAULT;
    const StepIcon = stepTypeConfig.icon;

    const typeColorClasses = {
        emerald: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300",
        blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
        gray: "bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300",
    };

    return (
        <motion.div
            whileHover={{ scale: isDragging ? 1 : 1.01 }}
            className={`
                relative p-5 bg-white dark:bg-gray-800 
                border-2 border-gray-200 dark:border-gray-700 
                rounded-xl transition-all duration-200
                ${isDragging
                    ? "shadow-2xl ring-2 ring-indigo-500/50"
                    : "shadow-sm hover:shadow-lg hover:border-indigo-200 dark:hover:border-indigo-800"
                }
            `}
        >
            {/* Header Section */}
            <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                    {/* Step Type Icon */}
                    <div className={`p-2.5 rounded-lg ${typeColorClasses[stepTypeConfig.color]}`}>
                        <StepIcon className="w-5 h-5" />
                    </div>

                    {/* Step Info */}
                    <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1 truncate">
                            {step.name}
                        </h3>
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${typeColorClasses[stepTypeConfig.color]}`}>
                                <StepIcon className="w-3 h-3" />
                                {stepTypeConfig.label}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onEdit}
                        className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 transition-colors"
                        title="Edit step"
                    >
                        <Edit3 className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onDelete}
                        className="p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 text-rose-600 dark:text-rose-400 transition-colors"
                        title="Delete step"
                    >
                        <Trash2 className="w-4 h-4" />
                    </motion.button>
                </div>
            </div>

            {/* Approver Section */}
            {step.approver && (
                <div className="mb-3">
                    {renderApprover(step)}
                </div>
            )}

            {/* Condition Section */}
            {step.conditionExpr && (
                <div className="p-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-start gap-2">
                        <div className="p-1 rounded bg-blue-100 dark:bg-blue-900/40">
                            <Zap className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide mb-1">
                                Condition
                            </p>
                            <p className="text-xs font-mono text-blue-900 dark:text-blue-100 break-all">
                                {step.conditionExpr}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Optional: Step Order Indicator */}
            {step.stepOrder && (
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center text-xs font-bold shadow-lg border-2 border-white dark:border-gray-900">
                    {step.stepOrder}
                </div>
            )}
        </motion.div>
    );
}
