import { X } from "lucide-react";
import { useState } from "react";

export default function RejectModal({ open, onClose, onSubmit }) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSubmit = () => {
    if (reason.trim() === "") {
      setError("Please enter a rejection reason");
      return;
    }
    setError("");
    onSubmit(reason);
    setReason("");
  };

  const handleClose = () => {
    setReason("");
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg">Reject competency</h2>
          <button onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        {/* Label */}
        <label className="text-sm font-medium text-gray-700">
          Rejection reason <span className="text-red-600">*</span>
        </label>

        <textarea
          value={reason}
          onChange={(e) => {
            setReason(e.target.value);
            if (e.target.value.trim() !== "") setError("");
          }}
          placeholder="Enter a rejection reason..."
          rows={4}
          className={`w-full border rounded-lg p-2 text-sm focus:ring 
          ${
            error ? "border-red-500 focus:ring-red-200" : "focus:ring-red-200"
          }`}
        />

        {/* Error message */}
        {error && <p className="text-red-600 text-xs mt-1">{error}</p>}

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-lg border text-sm"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg text-sm bg-red-600 text-white hover:bg-red-700"
          >
            Confirm rejection
          </button>
        </div>
      </div>
    </div>
  );
}
