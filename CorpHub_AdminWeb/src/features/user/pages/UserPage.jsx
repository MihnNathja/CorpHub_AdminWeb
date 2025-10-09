import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, addUser } from "../store/userSlice";
import UserTable from "../components/UserTable";
import UserDetailModal from "../components/UserDetailModal";
import UserForm from "../components/UserForm";
import { useLocation } from "react-router-dom";

const UserPage = () => {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.user);

  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const tab = params.get("tab");
  const ticketId = params.get("ticketId");

  const [activeTab, setActiveTab] = useState(tab || "list");

  useEffect(() => {
    if (tab) setActiveTab(tab);
  }, [tab]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (tab) setActiveTab(tab);
  }, [tab]);

  const handleAddUser = (userData) => {
    dispatch(addUser(userData));
    setIsModalOpen(false);
  };

  const tabs = [
    { key: "list", label: "Danh sách tài khoản" },
    { key: "add", label: "Thêm tài khoản mới" },
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl shadow-inner p-6 transition-colors">
      <h2 className="text-xl dark:text-gray-100 font-bold mb-4">
        Quản lý người dùng
      </h2>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 -mb-px font-medium rounded-t-lg transition-colors ${
              activeTab === tab.key
                ? "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 border-b-0 text-gray-900 dark:text-gray-100"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-b-lg p-4 -mt-px bg-white dark:bg-gray-800">
        {activeTab === "list" && (
          <>
            {/* Table */}
            {loading && <p className="dark:text-gray-200">Loading...</p>}
            {error && (
              <p className="text-red-500 dark:text-red-400">Error: {error}</p>
            )}
            {!loading && !error && (
              <UserTable users={list} onSelectUser={setSelectedUserId} />
            )}
          </>
        )}

        {/* Tab Add */}
        {activeTab === "add" && (
          <UserForm onSubmit={handleAddUser} ticketId={ticketId} />
        )}
      </div>

      {/* Modal User Detail */}
      <UserDetailModal
        isOpen={!!selectedUserId}
        onClose={() => setSelectedUserId(null)}
        userId={selectedUserId}
      />
    </div>
  );
};

export default UserPage;
