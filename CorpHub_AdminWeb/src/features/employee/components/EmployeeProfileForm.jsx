import { useState } from "react";

import JobHistorySection from "./JobHistorySection";
import CompetencySection from "./CompetencySection";
import { useEmployee } from "../hooks/useEmployee";
import BasicInfoSection from "./BasicInfoSection";
import { useDepartment } from "../../department/hooks/useDepartment";

const EmployeeProfileForm = () => {
  const [profile, setProfile] = useState({
    fullName: "",
    dob: "",
    gender: "",
    phone: "",
    personalEmail: "",
    departmentId: "",
    jobHistories: [],
    competencies: [],
  });

  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [fileAvatar, setFileAvatar] = useState(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileAvatar(file); // lưu file thật
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewAvatar(reader.result); // chỉ để preview
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // JobHistories
  const [jobHistories, setJobHistories] = useState([
    {
      departmentId: "",
      position: "",
      contractType: "",
      startDate: "",
      endDate: "",
      employmentStatus: "",
      note: "",
    },
  ]);
  const handleJobChange = (i, f, v) => {
    const updated = [...jobHistories];
    updated[i][f] = v;
    setJobHistories(updated);
    setProfile((p) => ({ ...p, jobHistories: updated }));
  };
  const addJobHistory = () =>
    setJobHistories([
      ...jobHistories,
      {
        departmentId: "",
        position: "",
        contractType: "",
        startDate: "",
        endDate: "",
        employmentStatus: "",
        note: "",
      },
    ]);
  const removeJobHistory = (i) => {
    const updated = jobHistories.filter((_, idx) => idx !== i);
    setJobHistories(updated);
    setProfile((p) => ({ ...p, jobHistories: updated }));
  };

  // Competencies
  const [competencies, setCompetencies] = useState([
    { type: "", name: "", level: "", issuedBy: "", issuedDate: "", note: "" },
  ]);
  const handleCompetencyChange = (i, f, v) => {
    const updated = [...competencies];
    updated[i][f] = v;
    setCompetencies(updated);
    setProfile((p) => ({ ...p, competencies: updated }));
  };
  const addCompetency = () =>
    setCompetencies([
      ...competencies,
      { type: "", name: "", level: "", issuedBy: "", issuedDate: "", note: "" },
    ]);
  const removeCompetency = (i) => {
    const updated = competencies.filter((_, idx) => idx !== i);
    setCompetencies(updated);
    setProfile((p) => ({ ...p, competencies: updated }));
  };

  const { createProfile } = useEmployee();

  const handleSubmit = (e) => {
    e.preventDefault();
    createProfile(profile, fileAvatar); // truyền cả profile + file
  };

  const { departments } = useDepartment();

  return (
    <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl transition-colors shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Thêm Hồ sơ Nhân viên
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Nhập thông tin cơ bản, lịch sử công việc và năng lực kèm avatar để
            tạo mới hồ sơ.
          </p>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Trường bắt buộc được đánh dấu *
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <BasicInfoSection
          profile={profile}
          departments={departments}
          handleChange={handleChange}
          handleAvatarChange={handleAvatarChange}
          previewAvatar={previewAvatar}
        />
        <JobHistorySection
          jobHistories={jobHistories}
          handleJobChange={handleJobChange}
          addJobHistory={addJobHistory}
          removeJobHistory={removeJobHistory}
        />
        <CompetencySection
          competencies={competencies}
          handleCompetencyChange={handleCompetencyChange}
          addCompetency={addCompetency}
          removeCompetency={removeCompetency}
        />

        <div className="flex flex-col gap-2">
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-sm transition"
          >
            💾 Lưu Hồ sơ
          </button>
          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            Kiểm tra lại thông tin trước khi lưu để tránh phải chỉnh sửa sau
            này.
          </p>
        </div>
      </form>
    </div>
  );
};

export default EmployeeProfileForm;
