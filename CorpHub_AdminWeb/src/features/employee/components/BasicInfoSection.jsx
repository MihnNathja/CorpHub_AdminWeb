import React from "react";
import {
  User,
  Mail,
  Phone,
  VenusAndMars,
  Calendar,
  Briefcase,
  Building2,
} from "lucide-react";

const BasicInfoSection = ({
  profile,
  departments,
  positions,
  handleChange,
  onDepartmentChange,
  errors = {},
  positionsLoading,
}) => {
  const baseInput =
    "w-full rounded-xl border-2 bg-white dark:bg-gray-900 p-3 pl-11 text-sm focus:outline-none transition-all";
  const ringDefault =
    "border-gray-200 dark:border-gray-700 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/15";
  const ringError =
    "border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/20";

  const renderError = (msg) =>
    msg ? <p className="text-xs text-red-600 mt-1">{msg}</p> : null;

  const safePositions = positions || [];

  return (
    <section className="p-6 border rounded-2xl shadow-sm bg-white dark:bg-gray-900/60 border-gray-100 dark:border-gray-800">
      <div className="flex items-start justify-between gap-2 mb-5">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-500" /> Basic information
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Fields marked * are required to create a profile.
          </p>
        </div>
        <span className="text-xs px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-200 dark:border-indigo-700">
          Required
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
            <User className="w-4 h-4 text-indigo-500" /> Full name *
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              name="fullName"
              value={profile.fullName}
              onChange={handleChange}
              className={`${baseInput} ${
                errors.fullName ? ringError : ringDefault
              }`}
              placeholder="e.g. John Doe"
            />
          </div>
          {renderError(errors.fullName)}
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
            <Mail className="w-4 h-4 text-indigo-500" /> Personal email *
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="email"
              name="personalEmail"
              value={profile.personalEmail}
              onChange={handleChange}
              className={`${baseInput} ${
                errors.personalEmail ? ringError : ringDefault
              }`}
              placeholder="email@domain.com"
            />
          </div>
          {renderError(errors.personalEmail)}
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
            <Phone className="w-4 h-4 text-indigo-500" /> Phone number *
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              className={`${baseInput} ${
                errors.phone ? ringError : ringDefault
              }`}
              placeholder="09xx xxx xxx"
            />
          </div>
          {renderError(errors.phone)}
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
            <VenusAndMars className="w-4 h-4 text-indigo-500" /> Gender *
          </label>
          <div className="relative">
            <VenusAndMars className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <select
              name="gender"
              value={profile.gender}
              onChange={handleChange}
              className={`${baseInput} appearance-none ${
                errors.gender ? ringError : ringDefault
              }`}
            >
              <option value="">-- Select --</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          {renderError(errors.gender)}
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
            <Calendar className="w-4 h-4 text-indigo-500" /> Date of birth
          </label>
          <div className="relative">
            <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="date"
              name="dob"
              value={profile.dob}
              onChange={handleChange}
              className={`${baseInput} ${ringDefault}`}
            />
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
            <Calendar className="w-4 h-4 text-indigo-500" /> Join date *
          </label>
          <div className="relative">
            <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="date"
              name="joinDate"
              value={profile.joinDate}
              onChange={handleChange}
              className={`${baseInput} ${
                errors.joinDate ? ringError : ringDefault
              }`}
            />
          </div>
          {renderError(errors.joinDate)}
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
            <Building2 className="w-4 h-4 text-indigo-500" /> Department *
          </label>
          <div className="relative">
            <Building2 className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <select
              name="departmentId"
              value={profile.departmentId}
              onChange={onDepartmentChange || handleChange}
              className={`${baseInput} appearance-none ${
                errors.departmentId ? ringError : ringDefault
              }`}
            >
              <option value="">-- Select department --</option>
              {departments?.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
          {renderError(errors.departmentId)}
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
            <Briefcase className="w-4 h-4 text-indigo-500" /> Position *
          </label>
          <div className="relative">
            <Briefcase className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <select
              name="positionId"
              value={profile.positionId}
              onChange={handleChange}
              disabled={!profile.departmentId || positionsLoading}
              className={`${baseInput} appearance-none ${
                errors.positionId ? ringError : ringDefault
              } disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-400`}
            >
              <option value="">
                {!profile.departmentId
                  ? "Select a department first"
                  : positionsLoading
                  ? "Loading positions..."
                  : safePositions.length
                  ? "-- Select position --"
                  : "No positions available"}
              </option>
              {safePositions.map((pos) => (
                <option key={pos.id} value={pos.id}>
                  {pos.name}
                </option>
              ))}
            </select>
          </div>
          {renderError(errors.positionId)}
        </div>
      </div>
    </section>
  );
};

export default BasicInfoSection;
