import React, { useState } from "react";

export default function CompetencyBasicInfo({
  form,
  types,
  levelOptions,
  showCustomLevel,
  handleChange,
  handleTypeChange,
  handleLevelChange,
}) {
  const [showOptional, setShowOptional] = useState(false);

  return (
    <div className="space-y-5 text-sm">
      {/* === Group 1: Basic info === */}
      <div>
        <h5 className="font-medium text-gray-700 mb-2">🧩 Competency info</h5>
        <div className="grid grid-cols-2 gap-3">
          <input
            name="name"
            placeholder="Certificate / skill name"
            value={form.name}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <select
            name="typeId"
            value={form.typeId}
            onChange={handleTypeChange}
            className="border p-2 rounded"
          >
            <option value="">-- Select competency type --</option>
            {types.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          {showCustomLevel ? (
            <input
              name="levelName"
              placeholder="Enter custom level"
              value={form.levelName}
              onChange={handleChange}
              className="border p-2 rounded col-span-2"
            />
          ) : (
            <select
              name="levelId"
              value={form.levelId}
              onChange={handleLevelChange}
              className="border p-2 rounded col-span-2"
              disabled={!form.typeId}
            >
              <option value="">-- Select level --</option>
              {levelOptions.length > 0 ? (
                levelOptions.map((lv) => (
                  <option key={lv.id} value={lv.id}>
                    {lv.name}
                  </option>
                ))
              ) : (
                <option value="CUSTOM">No level - Enter manually</option>
              )}
              {levelOptions.length > 0 && (
                <option value="CUSTOM">Other...</option>
              )}
            </select>
          )}
        </div>
      </div>

      {/* === Group 2: Certificate info === */}
      <div>
        <h5 className="font-medium text-gray-700 mb-2">
          📄 Certificate information
        </h5>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col">
            <label className="text-xs text-gray-600 mb-1">Issuer</label>
            <input
              name="issuedBy"
              placeholder="e.g. ETS, Coursera..."
              value={form.issuedBy}
              onChange={handleChange}
              className="border p-2 rounded"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs text-gray-600 mb-1">Issued date</label>
            <input
              type="date"
              name="issuedDate"
              value={form.issuedDate}
              onChange={handleChange}
              className="border p-2 rounded"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs text-gray-600 mb-1">
              Certificate code
            </label>
            <input
              name="certificateCode"
              placeholder="Enter code / number"
              value={form.certificateCode}
              onChange={handleChange}
              className="border p-2 rounded"
            />
          </div>
        </div>

        {/* 🔽 Toggle advanced options */}
        <button
          type="button"
          onClick={() => setShowOptional((p) => !p)}
          className="text-xs text-blue-600 mt-3 hover:underline"
        >
          {showOptional ? "Hide advanced options ▲" : "Show advanced options ▼"}
        </button>

        {/* 🧭 Advanced options */}
        {showOptional && (
          <div className="mt-3 grid grid-cols-2 gap-3 border-t pt-3">
            <div className="flex flex-col">
              <label className="text-xs text-gray-600 mb-1">
                Expiration date
              </label>
              <input
                type="date"
                name="expireDate"
                value={form.expireDate}
                onChange={handleChange}
                className="border p-2 rounded"
              />
            </div>

            <div className="flex flex-col col-span-2">
              <label className="text-xs text-gray-600 mb-1">
                Verification link
              </label>
              <input
                name="verifyUrl"
                placeholder="https://verify.example.com"
                value={form.verifyUrl}
                onChange={handleChange}
                className="border p-2 rounded"
              />
            </div>

            <div className="flex flex-col col-span-2">
              <label className="text-xs text-gray-600 mb-1">Notes</label>
              <textarea
                name="note"
                placeholder="Add internal notes (optional)"
                value={form.note}
                onChange={handleChange}
                className="border p-2 rounded min-h-[80px]"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
