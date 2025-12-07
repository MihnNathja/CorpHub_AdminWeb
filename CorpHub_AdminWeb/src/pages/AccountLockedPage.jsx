import { useNavigate } from "react-router-dom";
import { LockClosedIcon, ShieldExclamationIcon, ArrowLeftIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import NoticePageLayout from "../layouts/NoticePageLayout";

const AccountLockedPage = () => {
  const navigate = useNavigate();

  return (
    <><NoticePageLayout
      icon={LockClosedIcon}
      iconColor="text-red-500"
      title="Tài khoản của bạn đã bị khóa"
      message="Tài khoản hiện đang bị vô hiệu hóa. Vui lòng liên hệ với quản trị viên để được hỗ trợ mở khóa."
      buttonText="Quay lại đăng nhập"
      onButtonClick={(navigate) => navigate("/login")} /><div className="min-h-screen bg-gradient-to-br from-rose-50 via-red-50 to-orange-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-md w-full"
        >
          {/* Card */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Header with animated gradient */}
            <div className="relative bg-gradient-to-r from-red-500 via-rose-500 to-pink-500 p-8 text-center overflow-hidden">
              <div className="absolute inset-0 bg-black/10" />

              {/* Animated background circles */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-0 left-0 w-32 h-32 bg-white/20 rounded-full blur-3xl" />
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute bottom-0 right-0 w-40 h-40 bg-white/20 rounded-full blur-3xl" />

              {/* Icon container */}
              <motion.div
                initial={{ rotate: -10, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="relative inline-flex items-center justify-center mb-4"
              >
                <div className="absolute inset-0 bg-white/30 rounded-full blur-xl" />
                <div className="relative bg-white/20 backdrop-blur-sm rounded-full p-6 border-4 border-white/40">
                  <LockClosedIcon className="w-16 h-16 text-white drop-shadow-lg" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h1 className="relative text-2xl font-bold text-white mb-2">
                  Account Locked
                </h1>
                <p className="relative text-white/90 text-sm">
                  Access denied
                </p>
              </motion.div>
            </div>

            {/* Content */}
            <div className="p-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-6"
              >
                {/* Alert box */}
                <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <ShieldExclamationIcon className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-red-800 dark:text-red-200 mb-1">
                        Your account has been locked
                      </h3>
                      <p className="text-sm text-red-700 dark:text-red-300">
                        Your account is currently disabled. Please contact your administrator for assistance with unlocking your account.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Info list */}
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Possible reasons:
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 font-bold">•</span>
                      <span>Multiple failed login attempts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 font-bold">•</span>
                      <span>Policy violation detected</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 font-bold">•</span>
                      <span>Account security measures</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 font-bold">•</span>
                      <span>Administrative action required</span>
                    </li>
                  </ul>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate("/login")}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                  >
                    <ArrowLeftIcon className="w-5 h-5" />
                    Back to Login
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => window.location.href = "mailto:admin@corpHub.com"}
                    className="w-full px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-xl transition-all"
                  >
                    Contact Administrator
                  </motion.button>
                </div>
              </motion.div>
            </div>

            {/* Footer */}
            <div className="px-8 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                Need help? Contact support at{" "}
                <a href="mailto:support@corpHub.com" className="text-red-600 dark:text-red-400 hover:underline font-semibold">
                  support@corpHub.com
                </a>
              </p>
            </div>
          </div>

          {/* Bottom text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6"
          >
            © 2024 CorpHub. All rights reserved.
          </motion.p>
        </motion.div>
      </div></>
  );
};

export default AccountLockedPage;
