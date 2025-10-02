import { Download, Trash2 } from "lucide-react";
import React from "react";

const TicketAttachments = ({ attachments = [], onDownload, onRemove }) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm">
      <label className="flex items-center gap-2 font-semibold mb-2">
        📎 Attachments
      </label>

      {attachments && attachments.length > 0 ? (
        <ul className="list-disc pl-5 space-y-2">
          {attachments.map((att) => (
            <li
              key={att.id}
              className="flex justify-between items-center text-sm bg-white dark:bg-gray-900 rounded-lg px-3 py-2 shadow-sm"
            >
              <span className="truncate">{att.originalName || att.path}</span>
              <div className="flex gap-2">
                {/* Download button */}
                <button
                  type="button"
                  onClick={() => onDownload(att.id)}
                  className="flex items-center gap-1 px-2 py-1 text-xs rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition"
                >
                  <Download className="w-4 h-4" />
                </button>

                {/* Delete button */}
                <button
                  type="button"
                  onClick={() => onRemove(att.id)}
                  className="flex items-center gap-1 px-2 py-1 text-xs rounded-lg bg-red-500 hover:bg-red-600 text-white transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-sm">No attachments</p>
      )}
    </div>
  );
};

export default TicketAttachments;
