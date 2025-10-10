import { Download, Trash2, Upload } from "lucide-react";
import React, { useRef, useState } from "react";
import { useAuth } from "../../auth/hooks/useAuth";

const TicketAttachments = ({
  ticket,
  attachments = [],
  onDownload,
  onRemove,
  onUpload,
  mode, // "view" | "edit" | "add"
}) => {
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const isOwner = ticket && user?.id === ticket?.requester?.id;
  const hasAttachments = attachments && attachments.length > 0;
  const canUpload = mode === "edit" || mode === "add";
  // && (ticket.status === "OPEN" || ticket.status === null);

  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm">
      <label className="flex items-center gap-2 font-semibold mb-2">
        📎 Attachments
      </label>
      {/* Danh sách file nếu có */}
      {hasAttachments ? (
        <ul className="list-disc pl-5 space-y-2">
          {attachments.map((att, index) => {
            const isNewFile = att instanceof File; // kiểm tra có phải file mới chọn
            const fileName = isNewFile
              ? att.name
              : att.originalName || att.path;

            return (
              <li
                key={isNewFile ? index : att.id}
                className="flex justify-between items-center text-sm bg-white dark:bg-gray-900 rounded-lg px-3 py-2 shadow-sm"
              >
                <div className="flex items-center gap-2">
                  {/* Preview hình ảnh nếu là image */}
                  {isNewFile && att.type.startsWith("image/") && (
                    <img
                      src={URL.createObjectURL(att)}
                      alt={att.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                  )}
                  <span className="truncate">{fileName}</span>
                </div>

                <div className="flex gap-2">
                  {/* Download */}
                  {!isNewFile && (
                    <button
                      type="button"
                      onClick={() => onDownload(att.id)}
                      className="flex items-center gap-1 px-2 py-1 text-xs rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  )}

                  {/* Delete */}
                  {canUpload && (
                    <button
                      type="button"
                      onClick={() => onRemove(index)}
                      className="flex items-center gap-1 px-2 py-1 text-xs rounded-lg bg-red-500 hover:bg-red-600 text-white transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-gray-500 text-sm">No attachments</p>
      )}
      {/* Upload: nếu mode là edit hoặc add + owner */}
      {canUpload ? (
        <div className="mt-3">
          <input
            type="file"
            multiple
            ref={fileInputRef}
            onChange={onUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-green-500 hover:bg-green-600 text-white transition"
          >
            <Upload className="w-4 h-4" />
            Upload Files
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default TicketAttachments;
