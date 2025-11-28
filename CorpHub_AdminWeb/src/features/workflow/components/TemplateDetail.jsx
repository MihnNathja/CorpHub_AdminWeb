import { Calendar } from "lucide-react";

export default function TemplateDetail({ template }) {
    if (!template) return null;

    return (
        <div className="mb-6 p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                {template.name}
            </h1>

            <div className="text-gray-600 dark:text-gray-400 text-sm">
                Entity: {template.targetEntity}
            </div>

            <div className="mt-3 flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                    <Calendar size={14} /> Created {template.createdAt}
                </div>
                <div className="text-gray-400">•</div>
                <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                    Updated {template.updatedAt}
                </div>
            </div>
        </div>
    );
}
