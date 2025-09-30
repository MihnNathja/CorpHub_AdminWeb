import { useNavigate } from "react-router-dom";

const NoticePageLayout = ({
  icon: Icon,
  iconColor = "text-gray-500",
  title,
  message,
  buttonText = "Quay lại",
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          {Icon && <Icon className={`h-16 w-16 ${iconColor}`} />}
        </div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          {title}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition"
        >
          {buttonText}
        </button>
      </div>

      <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
        © 2025 - Hệ thống quản lý nội bộ
      </p>
    </div>
  );
};

export default NoticePageLayout;
