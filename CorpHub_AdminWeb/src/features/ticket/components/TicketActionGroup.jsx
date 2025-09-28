import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";

export default function TicketActionGroup({ status, onAccept, onReject, loading = false }) {
    if (status === "OPEN") {
        return (
            <div className="flex gap-2">
                <button
                    type="button"
                    disabled={loading}
                    onClick={onAccept}
                    className={`flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-md 
            bg-transparent text-green-600 border border-green-600 hover:bg-green-50 transition
            ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                    {loading ? (
                        <svg
                            className="animate-spin h-4 w-4 text-green-600"
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
                        <CheckCircleIcon className="h-4 w-4" />
                    )}

                </button>

                <button
                    type="button"
                    disabled={loading}
                    onClick={onReject}
                    className={`flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-md 
            bg-transparent text-red-600 border border-red-600 hover:bg-red-50 transition
            ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                    <XCircleIcon className="h-4 w-4" />

                </button>
            </div>
        );
    }

    if (status === "REJECTED") {
        return <p className="text-red-600 font-medium">Rejected</p>;
    }

    return <p className="text-green-600 font-medium">Accepted</p>;
}
