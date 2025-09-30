import { XCircleIcon } from "@heroicons/react/24/solid";

export default function RejectButton({ onClick, loading = false }) {
  return (
    <button
      type="button"
      disabled={loading}
      onClick={onClick}
      className={`flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-md 
        bg-transparent text-red-600 border border-red-600 hover:bg-red-50 transition
        ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <XCircleIcon className="h-4 w-4" />
      Reject
    </button>
  );
}
