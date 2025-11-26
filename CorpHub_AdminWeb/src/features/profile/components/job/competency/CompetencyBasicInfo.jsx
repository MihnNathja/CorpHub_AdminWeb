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
      {/* === Nhóm 1: Thông tin cơ bản === */}
      <div>
        <h5 className="font-medium text-gray-700 mb-2">
          🧩 Thông tin năng lực
        </h5>
        <div className="grid grid-cols-2 gap-3">
          <input
            name="name"
            placeholder="Tên chứng chỉ / kỹ năng"
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
            <option value="">-- Chọn loại năng lực --</option>
            {types.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          {showCustomLevel ? (
            <input
              name="levelName"
              placeholder="Nhập cấp độ tùy chỉnh"
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
              <option value="">-- Chọn cấp độ --</option>
              {levelOptions.length > 0 ? (
                levelOptions.map((lv) => (
                  <option key={lv.id} value={lv.id}>
                    {lv.name}
                  </option>
                ))
              ) : (
                <option value="CUSTOM">Không có cấp độ - Nhập tay</option>
              )}
              {levelOptions.length > 0 && (
                <option value="CUSTOM">Khác...</option>
              )}
            </select>
          )}
        </div>
      </div>

      {/* === Nhóm 2: Thông tin chứng chỉ === */}
      <div>
        <h5 className="font-medium text-gray-700 mb-2">
          📄 Thông tin chứng chỉ
        </h5>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col">
            <label className="text-xs text-gray-600 mb-1">Tổ chức cấp</label>
            <input
              name="issuedBy"
              placeholder="VD: ETS, Coursera..."
              value={form.issuedBy}
              onChange={handleChange}
              className="border p-2 rounded"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs text-gray-600 mb-1">Ngày cấp</label>
            <input
              type="date"
              name="issuedDate"
              value={form.issuedDate}
              onChange={handleChange}
              className="border p-2 rounded"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs text-gray-600 mb-1">Mã chứng chỉ</label>
            <input
              name="certificateCode"
              placeholder="Nhập mã / số hiệu"
              value={form.certificateCode}
              onChange={handleChange}
              className="border p-2 rounded"
            />
          </div>
        </div>

        {/* 🔽 Nút mở rộng tùy chọn */}
        <button
          type="button"
          onClick={() => setShowOptional((p) => !p)}
          className="text-xs text-blue-600 mt-3 hover:underline"
        >
          {showOptional
            ? "Ẩn tùy chọn nâng cao ▲"
            : "Hiển thị tùy chọn nâng cao ▼"}
        </button>

        {/* 🧭 Khu vực tùy chọn nâng cao */}
        {showOptional && (
          <div className="mt-3 grid grid-cols-2 gap-3 border-t pt-3">
            <div className="flex flex-col">
              <label className="text-xs text-gray-600 mb-1">Ngày hết hạn</label>
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
                Liên kết xác thực
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
              <label className="text-xs text-gray-600 mb-1">Ghi chú</label>
              <textarea
                name="note"
                placeholder="Thêm ghi chú nội bộ (không bắt buộc)"
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
