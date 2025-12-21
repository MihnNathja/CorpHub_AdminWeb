import { useMemo, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

// src/features/employee/components/KeyValue.jsx
const KeyValue = ({ icon: Icon, label, value, sensitive = false }) => {
  const [revealed, setRevealed] = useState(false);

  const maskedValue = useMemo(() => {
    if (!value) return "-";
    const stringValue = String(value);
    const visibleTail = stringValue.slice(-4);
    const maskedHead = "*".repeat(
      Math.max(4, stringValue.length - visibleTail.length)
    );
    return `${maskedHead}${visibleTail}`;
  }, [value]);

  const displayValue = sensitive && !revealed ? maskedValue : value || "-";

  return (
    <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50">
      {Icon && <Icon className="w-4 h-4 mt-1 text-gray-400" />}
      <div className="flex-1">
        <div className="text-xs uppercase text-gray-500">{label}</div>
        <div className="flex items-center gap-2 text-sm text-gray-800 break-all">
          <span>{displayValue}</span>
          {sensitive && value && (
            <button
              type="button"
              onClick={() => setRevealed((prev) => !prev)}
              className="inline-flex items-center gap-1 text-[12px] text-gray-500 hover:text-gray-700"
              aria-label={revealed ? "Hide value" : "Show value"}
            >
              {revealed ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
              <span>{revealed ? "Hide" : "Show"}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default KeyValue;
