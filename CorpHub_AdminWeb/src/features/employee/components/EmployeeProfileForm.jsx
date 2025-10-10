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
    <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl transition-colors">
      <h2 className="text-3xl font-bold text-blue-600 mb-8 text-center">
        Thêm Hồ sơ Nhân viên
      </h2>

      <form onSubmit={handleSubmit} className="space-y-10">
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

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg shadow"
        >
          💾 Lưu Hồ sơ
        </button>
      </form>
    </div>
  );
};

export default EmployeeProfileForm;
