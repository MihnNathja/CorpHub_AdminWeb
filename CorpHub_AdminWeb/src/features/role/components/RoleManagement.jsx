import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { mockRoles, allPermissions } from "./mockRoles";
import RoleTable from "./RoleTable";
import RoleFormModal from "./RoleFormModal";

const RoleManagement = () => {
  const [roles, setRoles] = useState(mockRoles);
  const [isOpen, setIsOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);

  const handleSave = (role) => {
    if (role.id) {
      setRoles((prev) => prev.map((r) => (r.id === role.id ? { ...role } : r)));
    } else {
      setRoles((prev) => [...prev, { ...role, id: Date.now() }]);
    }
    setIsOpen(false);
  };

  return (
    <div className="p-6 space-y-4">
      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Quản lý vai trò & phân quyền</CardTitle>
          <Button
            onClick={() => {
              setEditingRole(null);
              setIsOpen(true);
            }}
          >
            Thêm vai trò
          </Button>
        </CardHeader>
        <CardContent>
          <RoleTable
            roles={roles}
            allPermissions={allPermissions}
            onEdit={(role) => {
              setEditingRole(role);
              setIsOpen(true);
            }}
          />
        </CardContent>
      </Card>

      <RoleFormModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSave={handleSave}
        allPermissions={allPermissions}
        role={editingRole}
      />
    </div>
  );
};

export default RoleManagement;
