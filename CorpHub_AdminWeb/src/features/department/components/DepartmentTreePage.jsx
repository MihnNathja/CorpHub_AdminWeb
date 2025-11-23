import React, { useState } from "react";
import DepartmentTreeView from "./DepartmentTreeView";

import { PlusCircle } from "lucide-react";
import { mockDepartments } from "../mockDepartment";
import AssignManagerModal from "./AssignManagerModal";

const DepartmentTreePage = () => {
  const [treeData, setTreeData] = useState(mockDepartments);

  const [selectedDept, setSelectedDept] = useState(null);
  const [managerModalOpen, setManagerModalOpen] = useState(false);

  const handleEdit = (dept) => {
    console.log("✏ Edit: ", dept);
  };

  const handleDelete = (id) => {
    console.log("🗑 Delete: ", id);
  };

  const handleAddChild = (parent) => {
    console.log("➕ Add child to: ", parent);
  };

  const handleAssignManager = (dept) => {
    setSelectedDept(dept);
    setManagerModalOpen(true);
  };

  const handleSelectManager = async (user) => {
    //await setManagerApi(selectedDept.id, user.id);

    console.log(`✔ Gán ${user.fullName} làm manager của ${selectedDept.name}`);

    setManagerModalOpen(false);

    // TODO: gọi lại API lấy cây department
  };

  return (
    <div className="p-6 space-y-4">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
          Cơ cấu tổ chức
        </h1>
      </div>

      {/* TREE VIEW */}
      <DepartmentTreeView
        data={treeData}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAddChild={handleAddChild}
        onAssignManager={handleAssignManager}
      />
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
