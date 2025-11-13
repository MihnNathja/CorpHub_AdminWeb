import { X } from "lucide-react";
import { useState } from "react";

export default function RejectModal({ open, onClose, onSubmit }) {
  const [reason, setReason] = useState("");

  if (!open) return null;

  const handleSubmit = () => {
    if (reason.trim() === "") return;
    onSubmit(reason);
    setReason("");
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-96">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg">Từ chối competency</h2>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Nhập lý do từ chối..."
          rows={4}
          className="w-full border rounded-lg p-2 text-sm focus:ring focus:ring-red-200"
        />

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border text-sm"
          >
            Hủy
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg text-sm bg-red-600 text-white hover:bg-red-700"
          >
            Xác nhận từ chối
          </button>
        </div>
      </div>
    </div>
  );
}
