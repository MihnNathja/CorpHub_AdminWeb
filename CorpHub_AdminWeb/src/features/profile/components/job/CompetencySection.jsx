import { useState, useMemo } from "react";
import { LayoutList, BarChart3, AlertCircle } from "lucide-react";
import Section from "../Section";
import CompetencyTable from "./CompetencyTable";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

// ====================== Utility ======================
const levelToValue = (level) => {
  if (!level) return 0;
  const map = {
    Beginner: 1,
    Basic: 2,
    Intermediate: 3,
    Advanced: 4,
    Expert: 5,
  };
  return map[level] || parseInt(level) || 0;
};

// ====================== Progress bar ======================
const SkillProgress = ({ name, level }) => {
  const value = levelToValue(level);
  const percent = (value / 5) * 100;
  const color =
    value >= 4 ? "bg-green-500" : value >= 3 ? "bg-yellow-400" : "bg-gray-400";

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span>{name}</span>
        <span className="text-gray-500">{value}/5</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`${color} h-2 rounded-full transition-all`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

// ====================== Radar chart ======================
const CompetencyRadar = ({ competencies }) => {
  const data = competencies.map((c) => ({
    name: c.name,
    levelValue: levelToValue(c.level),
  }));

  if (data.length === 0)
    return (
      <div className="text-center text-sm text-gray-500 italic py-6">
        Chưa có dữ liệu kỹ năng để hiển thị biểu đồ
      </div>
    );

  return (
    <div className="h-72 mt-3">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="name" />
          <PolarRadiusAxis angle={30} domain={[0, 5]} />
          <Radar
            name="Mức độ kỹ năng"
            dataKey="levelValue"
            stroke="#2563eb"
            fill="#3b82f6"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

// ====================== Component chính ======================
const CompetencySection = ({ competencies }) => {
  const [viewMode, setViewMode] = useState("table"); // table | chart
  const [selectedSkills, setSelectedSkills] = useState(() =>
    competencies.slice(0, 5).map((c) => c.id)
  );
  const [warning, setWarning] = useState("");

  const MAX_SKILLS = 8;

  const filteredCompetencies = useMemo(
    () => competencies.filter((c) => selectedSkills.includes(c.id)),
    [competencies, selectedSkills]
  );

  const handleToggleSkill = (id) => {
    setWarning(""); // reset cảnh báo

    setSelectedSkills((prev) => {
      const isSelected = prev.includes(id);

      if (isSelected) {
        return prev.filter((s) => s !== id);
      }

      // Nếu thêm mới mà đã đủ giới hạn
      if (prev.length >= MAX_SKILLS) {
        setWarning(
          `⚠️ Chỉ được chọn tối đa ${MAX_SKILLS} kỹ năng để hiển thị trên biểu đồ.`
        );
        return prev;
      }

      return [...prev, id];
    });
  };

  return (
    <Section
      title="Chứng chỉ & Kỹ năng"
      right={
        <button
          onClick={() => setViewMode(viewMode === "table" ? "chart" : "table")}
          className="px-3 py-1.5 text-sm border rounded-xl hover:bg-gray-50 flex items-center gap-1"
        >
          {viewMode === "table" ? (
            <>
              <BarChart3 size={16} /> Dạng biểu đồ
            </>
          ) : (
            <>
              <LayoutList size={16} /> Dạng bảng
            </>
          )}
        </button>
      }
    >
      {viewMode === "table" ? (
        <CompetencyTable items={competencies} />
      ) : (
        <div className="mt-4 space-y-6">
          {/* Khu chọn kỹ năng */}
          <div>
            <h4 className="font-medium text-sm mb-2">
              Chọn kỹ năng hiển thị trên biểu đồ
            </h4>
            {competencies.length === 0 ? (
              <div className="text-sm text-gray-500 italic">
                Không có kỹ năng nào để chọn
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-36 overflow-y-auto">
                  {competencies.map((c) => (
                    <label
                      key={c.id}
                      className="flex items-center gap-2 text-sm cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedSkills.includes(c.id)}
                        onChange={() => handleToggleSkill(c.id)}
                        className="w-4 h-4 accent-blue-600"
                      />
                      <span>{c.name}</span>
                    </label>
                  ))}
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  Đã chọn: {selectedSkills.length}/{MAX_SKILLS}
                </div>
                {warning && (
                  <div className="flex items-center gap-1 text-yellow-600 text-sm mt-1">
                    <AlertCircle size={14} />
                    <span>{warning}</span>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Biểu đồ radar + thanh kỹ năng */}
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-medium text-sm mb-2">Biểu đồ kỹ năng</h4>
              <CompetencyRadar competencies={filteredCompetencies} />
            </div>

            <div>
              <h4 className="font-medium text-sm mb-2">Mức độ chi tiết</h4>
              <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
                {filteredCompetencies.length > 0 ? (
                  filteredCompetencies.map((c) => (
                    <SkillProgress key={c.id} name={c.name} level={c.level} />
                  ))
                ) : (
                  <div className="text-sm text-gray-500 italic">
                    Chưa chọn kỹ năng nào để hiển thị
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Section>
  );
};

export default CompetencySection;
