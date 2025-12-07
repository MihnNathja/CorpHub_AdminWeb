// src/components/AuthInitializer.jsx
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { refresh } from "../features/auth/store/authSlice";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Shield, CheckCircle } from "lucide-react";

export default function AuthInitializer({ children }) {
    const dispatch = useDispatch();
    const didInit = useRef(false);
    const [checking, setChecking] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // 🧠 Chỉ chạy refresh 1 lần khi app load
        if (!didInit.current) {
            didInit.current = true;

            // Simulate progress for better UX
            const progressInterval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return 90;
                    }
                    return prev + 10;
                });
            }, 100);

            // Luôn thử refresh, backend sẽ xác định hợp lệ hay không
            dispatch(refresh()).finally(() => {
                clearInterval(progressInterval);
                setProgress(100);
                setTimeout(() => setChecking(false), 300);
            });
        }
    }, [dispatch]);

    // ⏳ Hiển thị trong lúc đang kiểm tra
    if (checking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3],
                            rotate: [0, 180, 360],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                        className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.2, 0.4, 0.2],
                            rotate: [360, 180, 0],
                        }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"
                    />
                </div>

                {/* Main content */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative z-10 text-center"
                >
                    {/* Logo/Icon container */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="mb-8 flex justify-center"
                    >
                        <div className="relative">
                            {/* Rotating ring */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                                className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-purple-500"
                            />

                            {/* Icon container */}
                            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 flex items-center justify-center shadow-2xl">
                                <Shield className="w-10 h-10 text-white" />
                            </div>

                            {/* Pulse effect */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.5, 1],
                                    opacity: [0.5, 0, 0.5],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                className="absolute inset-0 rounded-full bg-blue-500"
                            />
                        </div>
                    </motion.div>

                    {/* Text content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-4"
                    >
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                            CorpHub
                        </h1>

                        <div className="flex items-center justify-center gap-3">
                            <Loader2 className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin" />
                            <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">
                                Đang khởi tạo phiên đăng nhập...
                            </p>
                        </div>

                        {/* Progress bar */}
                        <div className="w-64 mx-auto">
                            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.3 }}
                                    className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full"
                                />
                            </div>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="text-sm text-gray-500 dark:text-gray-400 mt-2"
                            >
                                {progress}%
                            </motion.p>
                        </div>

                        {/* Status messages */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="space-y-2 text-sm text-gray-500 dark:text-gray-400"
                        >
                            <AnimatePresence mode="wait">
                                {progress < 30 && (
                                    <motion.p
                                        key="connecting"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                    >
                                        🔗 Kết nối với server...
                                    </motion.p>
                                )}
                                {progress >= 30 && progress < 70 && (
                                    <motion.p
                                        key="verifying"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                    >
                                        🔐 Xác thực phiên làm việc...
                                    </motion.p>
                                )}
                                {progress >= 70 && progress < 100 && (
                                    <motion.p
                                        key="loading"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                    >
                                        ⚙️ Tải cấu hình...
                                    </motion.p>
                                )}
                                {progress === 100 && (
                                    <motion.p
                                        key="ready"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        Hoàn tất!
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </motion.div>

                    {/* Loading dots */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="flex justify-center gap-2 mt-8"
                    >
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                animate={{
                                    scale: [1, 1.5, 1],
                                    opacity: [0.3, 1, 0.3],
                                }}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    delay: i * 0.2,
                                }}
                                className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"
                            />
                        ))}
                    </motion.div>
                </motion.div>

                {/* Bottom text */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="absolute bottom-8 left-0 right-0 text-center text-xs text-gray-400 dark:text-gray-500"
                >
                    © 2024 CorpHub. All rights reserved.
                </motion.p>
            </div>
        );
    }

    // ✅ Khi đã check xong → render app với fade transition
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {children}
        </motion.div>
    );
}
