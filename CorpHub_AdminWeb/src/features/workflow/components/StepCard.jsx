import { GripVertical, Pencil, Trash2 } from "lucide-react";

export default function StepCard({ step, onEdit, onDelete }) {
    return (
        <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition">

            <div className="flex justify-between">
                <div className="flex gap-3 items-start">
                    {/* Drag handle */}
                    <GripVertical className="text-gray-400 dark:text-gray-500 cursor-grab active:cursor-grabbing" />

                    <div>
                        <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                            {step.name}
                        </div>

                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            Type: {step.stepType}
                        </div>

                        {step.assignedRole && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                Role: {step.assignedRole}
                            </div>
                        )}

                        {step.conditionExpr && (
                            <div className="text-xs text-blue-600 dark:text-blue-400">
                                Condition: {step.conditionExpr}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={onEdit}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <Pencil size={18} />
                    </button>

                    <button
                        onClick={onDelete}
                        className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-700/40 text-red-500"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
