import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";

const options = [
    {
        value: "ACCEPTED",
        label: "Accepted",
        icon: CheckCircleIcon,
        activeColor: "bg-green-600 text-white",
    },
    {
        value: "REJECTED",
        label: "Rejected",
        icon: XCircleIcon,
        activeColor: "bg-red-600 text-white",
    },
];

export default function StatusButtonGroup({ value, onChange, loading = false }) {
    return (
        <div className="inline-flex rounded-md shadow-sm border border-gray-300 overflow-hidden">
            {options.map((opt, idx) => {
                const isActive = value === opt.value;
                return (
                    <button
                        key={opt.value}
                        type="button"
                        disabled={loading}
                        onClick={() => onChange(opt.value)}
                        className={`flex items-center gap-1 px-3 py-1 text-sm font-medium transition
                            ${isActive ? opt.activeColor : "bg-white hover:bg-gray-100"}
                            ${loading ? "opacity-50 cursor-not-allowed" : ""}
                            ${idx === 0 ? "rounded-l-md" : idx === options.length - 1 ? "rounded-r-md" : ""}
                        `}
                    >
                        {loading && isActive ? (
                            <svg
                                className="animate-spin h-4 w-4 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                />
                            </svg>
                        ) : (
                            <opt.icon className="h-4 w-4" />
                        )}
                        {opt.label}
                    </button>
                );
            })}
        </div>
    );
}
