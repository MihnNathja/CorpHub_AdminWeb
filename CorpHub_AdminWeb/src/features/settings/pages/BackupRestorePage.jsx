import { useState } from "react";
import { DatabaseBackup, Download, UploadCloud, Trash2 } from "lucide-react";

export default function BackupRestorePage() {
  const [backups, setBackups] = useState([
    { id: "1", name: "backup_2025-11-01.zip", date: "2025-11-01 08:30" },
    { id: "2", name: "backup_2025-11-05.zip", date: "2025-11-05 10:45" },
  ]);

  const handleCreateBackup = () => {
    const newBackup = {
      id: crypto.randomUUID(),
      name: `backup_${new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", "_")}.zip`,
      date: new Date().toLocaleString(),
    };
    setBackups((prev) => [newBackup, ...prev]);
  };

  const handleRestore = (backup) => {
    alert(`Khôi phục từ bản sao lưu: ${backup.name}`);
  };

  const handleDelete = (id) => {
    setBackups((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DatabaseBackup size={20} className="text-gray-600" />
          <h2 className="text-lg font-semibold">Sao lưu & khôi phục dữ liệu</h2>
        </div>
        <button
          onClick={handleCreateBackup}
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <UploadCloud size={18} /> Tạo bản sao lưu
        </button>
      </div>

      <table className="min-w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2 w-80">Tên file</th>
            <th className="border p-2 w-56">Thời gian tạo</th>
            <th className="border p-2 text-center w-40">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {backups.length === 0 ? (
            <tr>
              <td colSpan={3} className="text-center p-4 italic text-gray-500">
                Chưa có bản sao lưu nào
              </td>
            </tr>
          ) : (
            backups.map((b) => (
              <tr key={b.id} className="hover:bg-gray-50">
                <td className="border p-2">{b.name}</td>
                <td className="border p-2">{b.date}</td>
                <td className="border p-2 text-center space-x-3">
                  <button
                    onClick={() => handleRestore(b)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Download size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(b.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
