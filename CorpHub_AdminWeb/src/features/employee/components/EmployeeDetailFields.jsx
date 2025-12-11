import React from "react";

export const InputField = ({
  label,
  type = "text",
  value,
  onChange,
  className,
}) => (
  <label className={`flex flex-col gap-1 text-sm ${className || ""}`}>
    <span className="text-gray-600 dark:text-gray-300">{label}</span>
    <input
      type={type}
      value={value || ""}
      onChange={onChange}
      className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-800 shadow-sm focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
    />
  </label>
);

export const TextAreaField = ({
  label,
  value,
  onChange,
  rows = 3,
  className,
}) => (
  <label className={`flex flex-col gap-1 text-sm ${className || ""}`}>
    <span className="text-gray-600 dark:text-gray-300">{label}</span>
    <textarea
      rows={rows}
      value={value || ""}
      onChange={onChange}
      className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-800 shadow-sm focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
    />
  </label>
);

export const SelectField = ({ label, value, onChange, options }) => (
  <label className="flex flex-col gap-1 text-sm">
    <span className="text-gray-600 dark:text-gray-300">{label}</span>
    <select
      value={value || ""}
      onChange={onChange}
      className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-800 shadow-sm focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </label>
);

export const InfoRow = ({ label, value }) => (
  <div className="flex justify-between gap-3 rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-800">
    <span className="text-gray-500">{label}</span>
    <span className="font-semibold text-gray-800 dark:text-gray-100">
      {value || "—"}
    </span>
  </div>
);

export const EmptyState = ({ label }) => (
  <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2 text-sm text-gray-500 dark:bg-gray-800 dark:text-gray-300">
    <span
      className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-200"
      aria-hidden="true"
    >
      !
    </span>
    <span>{label}</span>
  </div>
);
