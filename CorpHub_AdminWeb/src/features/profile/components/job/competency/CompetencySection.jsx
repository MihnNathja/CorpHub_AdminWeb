import { useState, useMemo, useEffect } from "react";
import { LayoutList, BarChart3, AlertCircle, Plus } from "lucide-react";
import Section from "../../Section";
import CompetencyTable from "./CompetencyTable";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import AddCompetencyForm from "./AddCompetencyForm";
import { useCompetency } from "../../../hooks/useCompetency";
import { useDocument } from "../../../hooks/useDocument";

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
    levelValue: levelToValue(c.levelName),
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
const CompetencySection = ({ profile }) => {
  const [viewMode, setViewMode] = useState("table");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [warning, setWarning] = useState("");
  const [showForm, setShowForm] = useState(false);

  const MAX_SKILLS = 8;

  // ✅ Dữ liệu từ Redux store
  const {
    items,
    create: createCompetency,
    remove: removeCompetency,
    update: updateCompetency,
    getMyCompetencies,
    loading,
  } = useCompetency();
  const { downloadDocument } = useDocument();

  // ✅ Lần đầu load danh sách
  useEffect(() => {
    getMyCompetencies(true);
  }, [getMyCompetencies]);

  // ✅ Khi items thay đổi, tự chọn 5 đầu tiên để hiển thị radar
  useEffect(() => {
    if (items.length > 0 && selectedSkills.length === 0) {
      setSelectedSkills(items.slice(0, 5).map((c) => c.id));
    }
  }, [items]);

  const filteredCompetencies = useMemo(
    () => items.filter((c) => selectedSkills.includes(c.id)),
    [items, selectedSkills]
  );

  const handleToggleSkill = (id) => {
    setWarning("");
    setSelectedSkills((prev) => {
      const isSelected = prev.includes(id);
      if (isSelected) return prev.filter((s) => s !== id);
      if (prev.length >= MAX_SKILLS) {
        setWarning(
          `⚠️ You can select up to ${MAX_SKILLS} skills to display on the chart.`
        );
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleAdded = async (payload) => {
    await createCompetency(payload);
    setShowForm(false);
  };

  return (
    <Section
      title="Certificates & Skills"
      right={
        <div className="flex gap-2">
          <button
            onClick={() => setShowForm((s) => !s)}
            className="px-3 py-1.5 text-sm border rounded-xl hover:bg-gray-50 flex items-center gap-1"
          >
            <Plus size={16} /> Thêm mới
          </button>
          <button
            onClick={() =>
              setViewMode(viewMode === "table" ? "chart" : "table")
            }
            className="px-3 py-1.5 text-sm border rounded-xl hover:bg-gray-50 flex items-center gap-1"
          >
            {viewMode === "table" ? (
              <>
                <BarChart3 size={16} /> Chart view
              </>
            ) : (
              <>
                <LayoutList size={16} /> Table view
              </>
            )}
          </button>
        </div>
      }
    >
      {/* 🔹 Form thêm mới */}
      {showForm && (
        <div className="mb-6">
          <AddCompetencyForm
            profile={profile}
            onCancel={() => setShowForm(false)}
            onAdded={handleAdded}
          />
        </div>
      )}

      {/* 🔹 Loading indicator */}
      {loading && (
        <div className="text-sm text-blue-600 italic mb-2">Loading data...</div>
      )}

      {/* 🔹 Nội dung chính */}
      {viewMode === "table" ? (
        <CompetencyTable
          items={items}
          onDownload={(id) => downloadDocument(id)}
          onDelete={(id, isDeletedFile) => removeCompetency(id, isDeletedFile)}
          onEdit={(formData) => {
            updateCompetency(formData);
          }}
        />
      ) : (
        <div className="mt-4 space-y-6">
          {/* Chọn kỹ năng hiển thị */}
          <div>
            <h4 className="font-medium text-sm mb-2">
              Select skills to display on chart
            </h4>
            {items.length === 0 ? (
              <div className="text-sm text-gray-500 italic">
                No skills to select
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-36 overflow-y-auto">
                  {items.map((c) => (
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
                  Selected: {selectedSkills.length}/{MAX_SKILLS}
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

          {/* Radar + Progress */}
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-medium text-sm mb-2">Skills chart</h4>
              <CompetencyRadar competencies={filteredCompetencies} />
            </div>
            <div>
              <h4 className="font-medium text-sm mb-2">Detailed levels</h4>
              <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
                {filteredCompetencies.length > 0 ? (
                  filteredCompetencies.map((c) => (
                    <SkillProgress
                      key={c.id}
                      name={c.name}
                      level={c.levelName}
                    />
                  ))
                ) : (
                  <div className="text-sm text-gray-500 italic">
                    No skills selected to display
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
