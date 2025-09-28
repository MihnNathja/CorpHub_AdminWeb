import React, { useMemo, useState, useEffect } from "react";
import { Loader2, X, CheckCircle2, XCircle } from "lucide-react";

/**
 * ReasonForm
 * Props:
 * - mode: "accept" | "reject" | "general" (ảnh hưởng label/validate)
 * - title?: string (tiêu đề trên form)
 * - defaultReason?: string
 * - maxLength?: number (default 300)
 * - minLengthWhenReject?: number (default 10)
 * - quickReasons?: string[] (các lý do gợi ý nhanh)
 * - loading?: boolean
 * - onSubmit: (reason: string) => void
 * - onCancel?: () => void
 */
export default function ReasonForm({
    mode = "reject",
    title,
    ticket,
    defaultReason = "",
    maxLength = 300,
    minLengthWhenReject = 10,
    quickReasons = [],
    loading = false,
    onSubmit,
    onCancel,
}) {
    if (!ticket)
        return;
    const [reason, setReason] = useState(defaultReason);

    useEffect(() => {
        setReason(defaultReason);
    }, [defaultReason]);

    const isReject = mode === "reject";
    const isAccept = mode === "accept";

    const headerIcon = useMemo(() => {
        if (isAccept) return <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />;
        if (isReject) return <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />;
        return <X className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
    }, [mode, isAccept, isReject]);

    const labelText = useMemo(() => {
        if (isAccept) return "Note (optional)";
        if (isReject) return "Reason for rejection";
        return "Reason / Note";
    }, [isAccept, isReject]);

    const helperText = useMemo(() => {
        if (isReject) return `Please provide a brief reason (at least ${minLengthWhenReject} characters).`;
        if (isAccept) return "You can add an optional note for the requester.";
        return "Explain why you perform this action.";
    }, [isReject, isAccept, minLengthWhenReject]);

    const remaining = maxLength - reason.length;

    const isValid = useMemo(() => {
        const trimmed = reason.trim();
        if (isReject) return trimmed.length >= minLengthWhenReject && trimmed.length <= maxLength;
        return trimmed.length <= maxLength; // accept/general không bắt buộc
    }, [reason, isReject, minLengthWhenReject, maxLength]);

    const handleQuickInsert = (text) => {
        // Chèn nhanh, cách nhau bằng dấu chấm nếu đã có nội dung
        setReason((prev) => {
            const base = prev.trim();
            const next = base ? `${base}${base.endsWith(".") ? "" : "."} ${text}` : text;
            return next.slice(0, maxLength);
        });
    };

    const handleSubmit = (e) => {
        e?.preventDefault?.();
        if (!isValid || loading) return;
        onSubmit?.(reason.trim());
    };

    const handleKeyDown = (e) => {
        // Ctrl/Cmd + Enter để submit nhanh
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
            handleSubmit(e);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            onKeyDown={handleKeyDown}
            className="w-full max-w-xl rounded-xl border border-gray-200 dark:border-gray-700 p-4
                 bg-white dark:bg-gray-800 shadow-sm"
        >
            <div className="flex items-center gap-2 mb-3">
                {headerIcon}
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    {title ?? (isReject ? "Provide a Rejection Reason" : isAccept ? "Add a Note (Optional)" : "Add a Reason")}
                </h3>
            </div>

            {quickReasons?.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                    {quickReasons.map((q, idx) => (
                        <button
                            key={`${q}-${idx}`}
                            type="button"
                            onClick={() => handleQuickInsert(q)}
                            className="px-2 py-1 text-xs rounded-md border border-gray-300 dark:border-gray-600
                         bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200
                         hover:bg-gray-50 dark:hover:bg-gray-600 transition"
                        >
                            + {q}
                        </button>
                    ))}
                </div>
            )}

            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {labelText}
            </label>

            <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value.slice(0, maxLength))}
                placeholder={
                    isReject
                        ? "E.g., Insufficient information, duplicate ticket, out of scope…"
                        : isAccept
                            ? "Optional note to the requester…"
                            : "Write your reason…"
                }
                className="w-full h-28 px-3 py-2 text-sm rounded-md border
                   border-gray-300 dark:border-gray-600
                   bg-white dark:bg-gray-900
                   text-gray-900 dark:text-gray-100
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />

            <div className="mt-1 flex items-center justify-between">
                <p className="text-xs text-gray-500 dark:text-gray-400">{helperText}</p>
                <span
                    className={`text-xs ${remaining < 0 ? "text-red-600 dark:text-red-400" : "text-gray-500 dark:text-gray-400"
                        }`}
                >
                    {remaining} chars left
                </span>
            </div>

            <div className="mt-4 flex items-center justify-end gap-2">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-3 py-1.5 text-sm font-medium rounded-md
                       border border-gray-300 dark:border-gray-600
                       bg-white dark:bg-gray-800
                       text-gray-700 dark:text-gray-200
                       hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                )}

                <button
                    type="submit"
                    disabled={!isValid || loading}
                    className={`px-3 py-1.5 text-sm font-semibold rounded-md transition inline-flex items-center gap-2
            ${isReject
                            ? "border border-red-600 text-red-600 bg-white hover:bg-red-50 dark:text-red-400 dark:border-red-400 dark:hover:bg-gray-700"
                            : "border border-green-600 text-green-600 bg-white hover:bg-green-50 dark:text-green-400 dark:border-green-400 dark:hover:bg-gray-700"
                        }
            ${(!isValid || loading) ? "opacity-50 cursor-not-allowed" : ""}`}
                    aria-disabled={!isValid || loading}
                >
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    {isReject ? "Submit Reason" : isAccept ? "Confirm" : "Submit"}
                </button>
            </div>
        </form>
    );
}
