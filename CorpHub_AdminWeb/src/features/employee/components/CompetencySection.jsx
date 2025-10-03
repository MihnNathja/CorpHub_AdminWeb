import React from "react";
import { PlusCircleIcon, TrashIcon } from "@heroicons/react/24/outline";

const CompetencySection = ({
  competencies,
  handleCompetencyChange,
  addCompetency,
  removeCompetency,
}) => {
  return (
    <section className="p-6 border rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
          Năng lực / Kỹ năng
        </h3>
        <button
          type="button"
          onClick={addCompetency}
          className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700"
        >
          <PlusCircleIcon className="h-5 w-5" /> Thêm
        </button>
      </div>

      <div className="space-y-4">
        {competencies.map((c, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-lg bg-gray-50 relative"
          >
            <select
              value={c.type}
              onChange={(e) =>
                handleCompetencyChange(index, "type", e.target.value)
              }
              className="border rounded-lg p-2"
            >
              <option value="">-- Loại --</option>
              <option value="SKILL">Kỹ năng</option>
              <option value="DEGREE">Bằng cấp</option>
              <option value="CERTIFICATION">Chứng chỉ</option>
              <option value="LANGUAGE">Ngoại ngữ</option>
            </select>
            <input
              type="text"
              placeholder="Tên"
              value={c.name}
              onChange={(e) =>
                handleCompetencyChange(index, "name", e.target.value)
              }
              className="border rounded-lg p-2"
            />
            <input
              type="text"
              placeholder="Trình độ"
              value={c.level}
              onChange={(e) =>
                handleCompetencyChange(index, "level", e.target.value)
              }
              className="border rounded-lg p-2"
            />
            <input
              type="text"
              placeholder="Đơn vị cấp"
              value={c.issuedBy}
              onChange={(e) =>
                handleCompetencyChange(index, "issuedBy", e.target.value)
              }
              className="border rounded-lg p-2"
            />
            <input
              type="date"
              value={c.issuedDate}
              onChange={(e) =>
                handleCompetencyChange(index, "issuedDate", e.target.value)
              }
              className="border rounded-lg p-2"
            />
            <input
              type="text"
              placeholder="Ghi chú"
              value={c.note}
              onChange={(e) =>
                handleCompetencyChange(index, "note", e.target.value)
              }
              className="border rounded-lg p-2"
            />
            <button
              type="button"
              onClick={() => removeCompetency(index)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CompetencySection;
