import React from "react";

export default function RecipientInput({
  recipients = [],                 // [{email, name}]
  onRemove,                        // (email) => void
  inputValue,
  onInputChange,                   // (value) => void
  onBackspaceRemove,               // optional: () => void (xóa chip cuối khi input rỗng)
  className = "",
}) {
  return (
    <div
      className={
        "flex flex-wrap items-center gap-2 p-2 rounded-md border " +
        "border-gray-300 dark:border-gray-600 " +
        "bg-white dark:bg-gray-700 " +
        "focus-within:ring-2 focus-within:ring-blue-500 " +
        "max-h-32 overflow-y-auto " +
        className
      }
    >
      {recipients.map((r) => (
        <span
          key={r.email}
          className="inline-flex items-center gap-1 px-2 py-1 rounded-full
                     bg-blue-100 text-blue-800 text-sm
                     dark:bg-blue-900 dark:text-blue-100"
          title={r.email}
        >
          <span className="truncate max-w-[160px]">{r.name || r.email}</span>
          <button
            type="button"
            onClick={() => onRemove?.(r.email)}
            className="ml-1 rounded-full px-1 hover:bg-red-100 hover:text-red-700
                       dark:hover:bg-red-400/20 dark:hover:text-red-300 transition-colors"
            aria-label={`Remove ${r.email}`}
          >
            ✕
          </button>
        </span>
      ))}

      {/* Input chung container với chip */}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => onInputChange?.(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Backspace" && !inputValue && recipients.length && onBackspaceRemove) {
            e.preventDefault();
            onBackspaceRemove();
          }
        }}
        placeholder="Nhập tên hoặc email..."
        className="flex-1 min-w-[160px] bg-transparent outline-none
                   text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-300"
      />
    </div>
  );
}
