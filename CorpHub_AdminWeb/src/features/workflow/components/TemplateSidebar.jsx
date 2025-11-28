import { PlusCircle, RefreshCcw } from "lucide-react";

export default function TemplateSidebar({
    templates,
    loading,
    selectedId,
    onSelect,
    onRefresh,
}) {
    return (
        <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                    Workflow Templates
                </h2>
                <button
                    onClick={onRefresh}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    <RefreshCcw size={18} />
                </button>
            </div>

            {loading && (
                <div className="text-gray-500 dark:text-gray-400">Loading...</div>
            )}

            <div className="flex flex-col gap-3">
                {templates.map(t => (
                    <div
                        key={t.id}
                        onClick={() => onSelect(t.id)}
                        className={`p-4 rounded-xl border cursor-pointer transition 
                            ${selectedId === t.id
                                ? "bg-blue-50 border-blue-300 dark:bg-blue-900/30 dark:border-blue-700"
                                : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                            }
                        `}
                    >
                        <div className="font-semibold text-gray-800 dark:text-gray-200">
                            {t.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                            Entity: {t.targetEntity}
                        </div>
                    </div>
                ))}
            </div>

            <button
                className="mt-6 w-full flex items-center justify-center gap-2 py-2 
                    bg-blue-500 text-white rounded-xl shadow hover:bg-blue-600"
            >
                <PlusCircle size={18} />
                New Template
            </button>
        </div>
    );
}
