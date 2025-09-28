import { useNavigate } from "react-router-dom";
import { LockClosedIcon } from "@heroicons/react/24/outline";

const UnauthorizedPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
                <div className="flex justify-center mb-4">
                    <LockClosedIcon className="h-16 w-16 text-red-500" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                    Truy cập bị từ chối
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Bạn không có quyền truy cập trang này. Nếu bạn nghĩ đây là lỗi, hãy liên hệ quản trị viên.
                </p>
                <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition"
                >
                    Quay lại
                </button>
            </div>

            <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                © 2025 - Hệ thống quản lý nội bộ
            </p>
        </div>
    );
};

export default UnauthorizedPage;
