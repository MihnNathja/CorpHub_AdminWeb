// src/components/AuthInitializer.jsx
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { refresh } from "../features/auth/store/authSlice";

export default function AuthInitializer({ children }) {
    const dispatch = useDispatch();
    const didInit = useRef(false);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        // 🧠 Chỉ chạy refresh 1 lần khi app load
        if (!didInit.current) {
            didInit.current = true;

            // Luôn thử refresh, backend sẽ xác định hợp lệ hay không
            dispatch(refresh())
                .finally(() => setChecking(false));
        }
    }, [dispatch]);

    // ⏳ Hiển thị trong lúc đang kiểm tra
    if (checking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                    Đang khởi tạo phiên đăng nhập...
                </p>
            </div>
        );
    }

    // ✅ Khi đã check xong → render app
    return children;
}
