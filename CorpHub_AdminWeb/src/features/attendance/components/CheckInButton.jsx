import { FingerPrintIcon } from "@heroicons/react/24/outline";

export default function CheckInButton({ onClick, disabled = false, title = "Chấm công" }) {
    return (
        <div className="relative group">
            <button
                onClick={onClick}
                disabled={disabled}
                title={disabled ? "Ca làm đã hết, không thể chấm công" : title}
                className={`
                    relative w-full py-4 px-6 
                    rounded-2xl font-semibold tracking-wide
                    flex items-center justify-center gap-3
                    transition-all duration-200
                    overflow-hidden
                    ${disabled
                        ? `
                            text-gray-600 dark:text-gray-500
                            bg-gradient-to-r from-gray-300 to-gray-400
                            dark:from-gray-700 dark:to-gray-800
                            shadow-lg shadow-gray-300/20 dark:shadow-gray-800/30
                            cursor-not-allowed opacity-60
                            `
                        : `
                            text-white
                            bg-gradient-to-r from-blue-500 to-blue-600
                            dark:from-blue-600 dark:to-blue-700
                            shadow-lg shadow-blue-500/30 dark:shadow-blue-700/30
                            hover:shadow-blue-500/50 dark:hover:shadow-blue-700/50
                            hover:scale-[1.02] active:scale-[0.97]
                            `
                    }
                `}
            >
                {/* Ripple effect */}
                {!disabled && (
                    <span className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-20 transition-opacity duration-300 rounded-2xl"></span>
                )}

                <FingerPrintIcon className={`w-7 h-7 `} />
                <span className="text-lg ">{title}</span>
            </button>
        </div>
    );
}
