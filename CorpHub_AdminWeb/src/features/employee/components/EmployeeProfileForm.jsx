import { useMemo, useState } from "react";
import { UserPlus, ShieldCheck, Sparkles, Save } from "lucide-react";

import { useEmployee } from "../hooks/useEmployee";
import BasicInfoSection from "./BasicInfoSection";
import { useDepartmentPositions } from "../../profile/hooks/useDepartmentPosition";

const EmployeeProfileForm = () => {
  const [profile, setProfile] = useState({
    fullName: "",
    dob: "",
    gender: "",
    phone: "",
    personalEmail: "",
    joinDate: "",
    departmentId: "",
    positionId: "",
  });

  const [errors, setErrors] = useState({});

  const { createProfile, loading } = useEmployee();
  const { departments: deptWithPositions, loading: positionsLoading } =
    useDepartmentPositions();

  const departments = useMemo(
    () =>
      (deptWithPositions || []).map((d) => ({
        id: d.departmentId,
        name: d.departmentName,
      })),
    [deptWithPositions]
  );

  const positionOptions = useMemo(() => {
    const selected = deptWithPositions?.find(
      (d) => d.departmentId === profile.departmentId
    );
    return selected?.positions || [];
  }, [deptWithPositions, profile.departmentId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleDepartmentChange = (e) => {
    const { value } = e.target;
    setProfile((prev) => ({ ...prev, departmentId: value, positionId: "" }));
  };

  const validateProfile = () => {
    const nextErrors = {};

    if (!profile.fullName.trim()) nextErrors.fullName = "Full name is required";
    if (!profile.phone.trim()) nextErrors.phone = "Phone number is required";

    if (!profile.personalEmail.trim()) {
      nextErrors.personalEmail = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.personalEmail)) {
      nextErrors.personalEmail = "Invalid email";
    }

    if (!profile.gender) nextErrors.gender = "Select gender";
    if (!profile.joinDate) {
      nextErrors.joinDate = "Select join date";
    } else {
      const joinDateObj = new Date(profile.joinDate);
      if (Number.isNaN(joinDateObj.getTime())) {
        nextErrors.joinDate = "Invalid join date";
      } else {
        const minDate = new Date("2000-01-01");
        const maxFuture = new Date();
        maxFuture.setMonth(maxFuture.getMonth() + 6); // cho phép tạo trước 6 tháng

        if (joinDateObj < minDate) {
          nextErrors.joinDate = "Join date is too far in the past";
        } else if (joinDateObj > maxFuture) {
          nextErrors.joinDate = "Join date should not exceed 6 months ahead";
        }
      }
    }
    if (!profile.departmentId) nextErrors.departmentId = "Select department";
    if (!profile.positionId) nextErrors.positionId = "Select position";

    return nextErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateProfile();
    setErrors(validation);
    if (Object.keys(validation).length) return;

    const payload = {
      fullName: profile.fullName.trim(),
      dob: profile.dob || null,
      gender: profile.gender,
      phone: profile.phone.trim(),
      personalEmail: profile.personalEmail.trim(),
      joinDate: profile.joinDate,
      departmentId: profile.departmentId,
      positionId: profile.positionId,
    };

    await createProfile(payload);
  };

  return (
    <div className="max-w-6xl mx-auto bg-white dark:bg-gray-900 p-8 rounded-3xl transition-colors shadow-xl border border-gray-100 dark:border-gray-800">
      <div className="rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-500 text-white p-6 shadow-sm border border-indigo-400/30 flex items-start gap-4">
        <div className="p-3 rounded-2xl bg-white/15 backdrop-blur-sm">
          <UserPlus className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-semibold">Add employee profile</h2>
          <p className="text-sm opacity-90 mt-1">
            Enter required info, select department and position. You can add
            more details after creation.
          </p>
        </div>
        <div className="hidden md:flex gap-2 text-xs text-white/90">
          <span className="px-3 py-1 rounded-full bg-white/15 border border-white/20 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4" /> Required
          </span>
          <span className="px-3 py-1 rounded-full bg-white/15 border border-white/20 flex items-center gap-1">
            <Sparkles className="w-4 h-4" /> 5 minutes to finish
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
        <div className="col-span-1 md:col-span-1 p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 text-indigo-900 dark:text-indigo-100">
          <p className="text-xs font-semibold uppercase tracking-wide mb-1">
            Checklist
          </p>
          <ul className="space-y-2 text-sm">
            <li>• Complete all 6 required fields</li>
            <li>• Valid, non-duplicate email</li>
            <li>• Department & position selected</li>
          </ul>
        </div>
        <div className="col-span-1 md:col-span-2 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200">
          <p className="text-xs font-semibold uppercase tracking-wide mb-1">
            Data notes
          </p>
          <ul className="text-sm space-y-1">
            <li>• Full name max 150 characters, no special characters.</li>
            <li>• Join date must be today or earlier per current policy.</li>
            <li>• Position depends on department; select department first.</li>
          </ul>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 mt-6">
        <BasicInfoSection
          profile={profile}
          departments={departments}
          positions={positionOptions}
          errors={errors}
          handleChange={handleChange}
          onDepartmentChange={handleDepartmentChange}
          positionsLoading={positionsLoading}
        />

        <div className="flex flex-col gap-3">
          <button
            type="submit"
            disabled={loading}
            className="relative w-full overflow-hidden group rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 px-5 py-3 text-white font-semibold shadow-xl shadow-indigo-500/25 transition disabled:from-indigo-400 disabled:via-indigo-400 disabled:to-blue-400 disabled:shadow-none"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition duration-500" />
            <span className="absolute -inset-x-10 -bottom-14 h-24 bg-indigo-300/40 blur-3xl opacity-0 group-hover:opacity-60 transition duration-500" />
            <span className="relative flex items-center justify-center gap-2 text-sm">
              <Save className="w-4 h-4" />
              {loading ? "Saving..." : "Save profile"}
            </span>
          </button>
          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            Review information before saving to avoid later edits.
          </p>
        </div>
      </form>
    </div>
  );
};

export default EmployeeProfileForm;
