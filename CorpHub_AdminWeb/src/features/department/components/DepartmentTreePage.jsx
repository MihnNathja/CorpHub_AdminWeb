import React, { useState } from "react";
import DepartmentTreeView from "./DepartmentTreeView";
import AssignManagerModal from "./AssignManagerModal";

const DepartmentTreePage = ({
  departments,
  onEditDepartment,
  onDeleteDepartment,
  onAddChildDepartment,
  onAssignManager,
  onMoveDepartment,
}) => {
  const [selectedDept, setSelectedDept] = useState(null);
  const [managerModalOpen, setManagerModalOpen] = useState(false);

  // Open manager selection modal
  const handleOpenAssignManager = (dept) => {
    setSelectedDept(dept);
    setManagerModalOpen(true);
  };

  // Callback after selecting manager
  const handleSelectManager = async (user) => {
    console.log("Select Manager:", selectedDept);
    await onAssignManager(selectedDept.id, user.userId);
    setManagerModalOpen(false);
  };

  return (
    <div className="p-6 space-y-4">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
          Organization structure
        </h1>
      </div>

      {/* TREE VIEW */}
      <DepartmentTreeView
        data={departments}
        onEdit={onEditDepartment}
        onDelete={onDeleteDepartment}
        onAddChild={onAddChildDepartment}
        onAssignManager={handleOpenAssignManager}
        onMoveDepartment={onMoveDepartment}
      />

      {/* Manager selection modal */}
      <AssignManagerModal
        open={managerModalOpen}
        dept={selectedDept}
        onClose={() => setManagerModalOpen(false)}
        onSelect={handleSelectManager}
      />
    </div>
  );
};

export default DepartmentTreePage;
