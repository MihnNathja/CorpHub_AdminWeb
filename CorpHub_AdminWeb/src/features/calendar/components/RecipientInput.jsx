import React from "react";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

function tokenize(value) {
  return value
    .split(/[,\n;]+/) // tách theo , ; xuống dòng
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseToken(token) {
  // Hỗ trợ "Name <email@x.com>"
  const m = token.match(/^(.*)<\s*([^>]+)\s*>$/);
  if (m) {
    const name = m[1].trim().replace(/(^"|"$)/g, "");
    const email = m[2].trim();
    return { email, name };
  }
  // Nếu là email thuần
  if (EMAIL_REGEX.test(token)) return { email: token, name: "" };
  // Không hợp lệ -> trả null
  return null;
}

export default function RecipientInput({
  recipients = [],                 // [{email, name}]
  onRemove,                        // (email) => void
  onAddRecipient,                  // NEW: ({email, name}) => void
  inputValue,
  onInputChange,                   // (value) => void
  onBackspaceRemove,               // optional: () => void
  className = "",
}) {
  const commitInput = (raw) => {
    const text = raw ?? inputValue ?? "";
    if (!text.trim()) return false;

    let added = false;
    const tokens = tokenize(text);
    tokens.forEach((t) => {
      const parsed = parseToken(t);
      if (parsed && EMAIL_REGEX.test(parsed.email)) {
        const email = parsed.email;
        // tránh trùng chip
        if (!recipients.some((r) => r.email === email)) {
          onAddRecipient?.({ email, name: parsed.name || "" });
          added = true;
        }
      }
    });
    if (added) onInputChange?.("");
    return added;
  };

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
          <span className="truncate max-w-[160px]">
            {r.name || r.email}
          </span>
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
            return;
          }
          // Enter / Tab / , / ; => commit thành chip
          if (
            e.key === "Enter" ||
            e.key === "Tab" ||
            e.key === "," ||
            e.key === ";"
          ) {
            const committed = commitInput();
            if (committed) e.preventDefault();
          }
        }}
        onBlur={() => {
          commitInput();
        }}
        onPaste={(e) => {
          const text = e.clipboardData.getData("text");
          if (!text) return;
          if (/[,\n;]/.test(text)) {
            e.preventDefault();
            commitInput(text);
          }
        }}
        placeholder="Nhập tên hoặc email... (Hỗ trợ: name@example.com hoặc Name <name@example.com>)"
        className="flex-1 min-w-[160px] bg-transparent outline-none
                   text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-300"
      />
    </div>
  );
}
