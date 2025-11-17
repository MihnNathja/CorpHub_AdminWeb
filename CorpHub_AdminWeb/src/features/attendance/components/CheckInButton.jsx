import { FingerPrintIcon } from "@heroicons/react/24/outline";

export default function CheckInButton({ onClick }) {
    return (
        <button
            onClick={onClick}
            className="
                relative w-full py-4 px-6 
                rounded-2xl font-semibold tracking-wide
                flex items-center justify-center gap-3
                text-white
                bg-gradient-to-r from-blue-500 to-blue-600
                dark:from-blue-600 dark:to-blue-700
                shadow-lg shadow-blue-500/30 dark:shadow-blue-700/30
                hover:shadow-blue-500/50 dark:hover:shadow-blue-700/50
                hover:scale-[1.02] active:scale-[0.97]
                transition-all duration-200
                overflow-hidden
            "
        >
            {/* Ripple effect */}
            <span className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-20 transition-opacity duration-300 rounded-2xl"></span>

            <FingerPrintIcon className="w-7 h-7" />
            <span className="text-lg">Chấm công</span>
        </button>
    );
}
