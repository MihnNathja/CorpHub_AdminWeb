import { CheckCircleIcon } from "@heroicons/react/24/solid";

export default function CompleteButton({ onClick, loading = false }) {
  return (
    <button
      type="button"
      disabled={loading}
      onClick={onClick}
      className={`flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-md 
        bg-transparent text-green-600 border border-green-600 hover:bg-green-50 transition
        ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <CheckCircleIcon className="h-4 w-4" />
      Complete
    </button>
  );
}
