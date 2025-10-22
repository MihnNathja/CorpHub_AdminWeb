import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { refresh } from "../features/auth/store/authSlice";
import { useNotifications } from "../features/notification/hooks/useNotifications";

const AppLayout = ({ children }) => {
    const dispatch = useDispatch();
    const { accessToken, user, loading } = useSelector((state) => state.auth);

    // ✅ Kích hoạt socket/notification (chỉ khi đã có user)
    useNotifications(accessToken, user?.id);

    // ⏳ Loader trong lúc refresh hoặc fetch profile
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                    Đang tải thông tin người dùng...
                </p>
            </div>
        );
    }

    return children;
};

export default AppLayout;
