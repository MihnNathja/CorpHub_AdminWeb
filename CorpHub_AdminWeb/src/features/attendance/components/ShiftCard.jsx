import { ClockIcon, LightBulbIcon } from "@heroicons/react/24/outline";

export default function ShiftCard({
    ws,
    shift,
    isSelected,
    isSuggested,
    isFinal,
    onSelect
}) {

    // BASE STYLE
    let borderColor = "border-gray-300 dark:border-gray-700";
    let borderStyle = "border-solid";
    let bg = "bg-white dark:bg-gray-800";
    let titleColor = "text-gray-900 dark:text-gray-100";

    // ⭐ Final shift (màu mạnh nhất)
    if (isFinal) {
        borderColor = "border-blue-500";
        borderStyle = "border-solid";
        bg = "bg-blue-50 dark:bg-blue-900/20";
        titleColor = "text-blue-700 dark:text-blue-300";
    }
    // ⭐ Selected shift (vàng)
    else if (isSelected) {
        borderColor = "border-yellow-500";
        borderStyle = "border-solid";
        bg = "bg-yellow-50 dark:bg-yellow-900/20";
        titleColor = "text-yellow-800 dark:text-yellow-300";
    }
    // ⭐ Suggested shift → NHẸ, không gây nhầm
    else if (isSuggested) {
        borderColor = "border-purple-300";
        borderStyle = "border-dashed"; // 🔥 Dùng dashed border
        bg = "bg-white dark:bg-gray-800"; // giữ nền
        titleColor = "text-purple-600 dark:text-purple-300"; // chỉ đổi text
    }

    return (
        <div
            onClick={onSelect}
            className={`
                rounded-xl border cursor-pointer select-none
                transition-all duration-200 p-4 space-y-3
                hover:shadow-md hover:-translate-y-0.5
                ${borderColor} ${borderStyle} ${bg}
            `}
        >
            {/* Header */}
            <div className="flex items-center gap-2">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <ClockIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </div>

                <h3 className={`font-semibold text-base ${titleColor}`}>
                    {shift.name}
                </h3>

                {/* ⭐ Suggested icon rất nhỏ, tinh tế */}
                {isSuggested && !isSelected && !isFinal && (
                    <LightBulbIcon className="w-4 h-4 text-purple-400 ml-1" />
                )}
            </div>

            {/* Time */}
            <div
                className="
                    bg-gray-100 dark:bg-gray-700 
                    rounded-lg px-3 py-2 
                    flex justify-between items-center 
                    text-sm font-medium 
                    text-gray-700 dark:text-gray-200
                "
            >
                <span>{shift.startTime.substring(0, 5)}</span>
                <span>{shift.endTime.substring(0, 5)}</span>
            </div>

            {/* Badges */}
            <div className="text-xs mt-1">
                {isFinal && (
                    <div className="text-blue-600 dark:text-blue-300 font-medium">
                        (Ca đang dùng)
                    </div>
                )}

                {!isFinal && isSelected && (
                    <div className="text-yellow-600 font-medium">
                        (Đã chọn)
                    </div>
                )}

                {!isFinal && !isSelected && isSuggested && (
                    <div className="text-purple-500 opacity-80 italic flex items-center gap-1">
                        <LightBulbIcon className="w-3 h-3" />
                        <span>Gợi ý</span>
                    </div>
                )}
            </div>
        </div>
    );
}
