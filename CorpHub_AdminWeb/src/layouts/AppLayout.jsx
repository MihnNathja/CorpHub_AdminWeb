import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../features/auth/store/authSlice";

const AppLayout = ({ children }) => {
    const dispatch = useDispatch();
    const { token, user, loading } = useSelector((state) => state.auth);

    // Mỗi khi có token mà chưa có user -> gọi API lấy thông tin user
    useEffect(() => {
        if (token && !user) {
            dispatch(fetchProfile());
        }
    }, [token, user, dispatch]);

    // Nếu đang gọi API profile -> hiển thị loader toàn trang
    if (token && !user && loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <p className="text-gray-600 dark:text-gray-300 text-lg">Đang tải thông tin người dùng...</p>
            </div>
        );
    }

    return children;
};

export default AppLayout;
