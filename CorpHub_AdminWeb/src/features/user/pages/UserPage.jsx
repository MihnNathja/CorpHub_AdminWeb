import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, addUser } from "../store/userSlice";
import UserTable from "../components/UserTable";
import UserDetailModal from "../components/UserDetailModal";
import UserForm from "../components/UserForm";
import { useLocation } from "react-router-dom";

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

  useEffect(() => {
    if (tab) setActiveTab(tab);
  }, [tab]);

  const handleAddUser = (userData) => {
    dispatch(addUser({ userData, ticketId }));
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl shadow-inner p-6 transition-colors">
      <h2 className="text-xl dark:text-gray-100 font-bold mb-4">
        User Management
      </h2>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {[
          { key: "list", label: "Users list" },
          { key: "add", label: "Add new user" },
        ].map((tab) => (
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

      <UserDetailModal
        isOpen={!!selectedUserId}
        onClose={() => setSelectedUserId(null)}
        userId={selectedUserId}
      />
    </div>
  );
};

export default UserPage;
