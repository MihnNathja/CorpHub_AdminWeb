import { PencilIcon } from "@heroicons/react/24/solid";

export default function EditButton({ onClick, loading = false }) {
    return (
        <button
            type="button"
            disabled={loading}
            onClick={onClick}
            className={`flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-md 
        bg-transparent text-orange-600 border border-orange-600 hover:bg-orange-50 transition
        ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
            <PencilIcon className="h-4 w-4" />
            Edit
        </button>
    );
}
