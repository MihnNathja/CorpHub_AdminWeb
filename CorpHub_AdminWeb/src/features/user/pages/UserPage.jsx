import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, addUser } from "../store/userSlice";
import UserTable from "../components/UserTable";
import UserDetailModal from "../components/UserDetailModal";
import UserForm from "../components/UserForm";
import { useLocation } from "react-router-dom";
import { Users, UserPlus } from "lucide-react";

const UserPage = () => {
  const dispatch = useDispatch();
  const { list, totalPages, loading, error } = useSelector(
    (state) => state.user
  );

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const tab = params.get("tab");
  const ticketId = params.get("ticketId");

  const [activeTab, setActiveTab] = useState(tab || "list");
  const [selectedUserId, setSelectedUserId] = useState(null);

  const tabs = useMemo(
    () => [
      {
        key: "list",
        label: "Danh sách",
        icon: Users,
      },
      {
        key: "add",
        label: "Tạo mới",
        icon: UserPlus,
      },
    ],
    []
  );

  useEffect(() => {
    if (tab) setActiveTab(tab);
  }, [tab]);

  const handleAddUser = (userData) => {
    return dispatch(addUser({ userData, ticketId })).unwrap();
  };

  // Khi có API update sẽ nối vào đây
  const handleEditUser = ({ id, data }) => {
    console.log("Edit user payload (chờ API)", { id, data });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl p-6 shadow-lg border border-white/10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-white/15 backdrop-blur-sm">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-white/80 uppercase tracking-wide">
              Management
            </p>
            <h1 className="text-3xl font-bold">User Management</h1>
          </div>
        </div>
        <p className="text-sm text-white/70 mt-2 ml-13">
          Quản lý người dùng, tạo mới tài khoản và thao tác nhanh
        </p>
      </div>

      {/* Tabs Card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 dark:border-gray-800 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-3 font-medium transition-all duration-200 border-b-2 text-sm whitespace-nowrap ${
                  isActive
                    ? "text-blue-600 dark:text-blue-400 border-b-blue-600 dark:border-b-blue-400 bg-blue-50/40 dark:bg-blue-900/20"
                    : "text-gray-600 dark:text-gray-400 border-b-transparent hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="p-5">
          {activeTab === "list" && (
            <UserTable
              onSelectUser={setSelectedUserId}
              onFetch={(page, keyword, filters, sort) =>
                dispatch(fetchUsers({ page, keyword, filters, sort }))
              }
            />
          )}

          {activeTab === "add" && (
            <UserForm onSubmit={handleAddUser} ticketId={ticketId} />
          )}
        </div>
      </div>

      <UserDetailModal
        isOpen={!!selectedUserId}
        onClose={() => setSelectedUserId(null)}
        userId={selectedUserId}
        onSubmitEdit={handleEditUser}
      />
    </div>
  );
};

export default UserPage;
