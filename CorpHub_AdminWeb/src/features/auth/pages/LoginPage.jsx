import { useSelector } from "react-redux";
import LoginForm from "../components/LoginForm";
import { motion } from "framer-motion";
import { Sparkles, Shield, Zap, TrendingUp } from "lucide-react";

const LoginPage = () => {
  const { loading, error } = useSelector((state) => state.auth);

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-32 -left-32 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.25, 0.45, 0.25],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/15 rounded-full blur-3xl"
        />
      </div>

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white/30 rounded-full"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full max-w-6xl px-4 z-10"
      >
        <div className="rounded-3xl shadow-2xl flex flex-col lg:flex-row overflow-hidden backdrop-blur-sm bg-white/95 dark:bg-gray-800/95 border border-white/50 dark:border-gray-700/50">
          {/* Left: Brand section */}
          <div className="relative flex flex-col items-center justify-center lg:w-1/2 p-12 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white overflow-hidden">
            {/* Animated gradient orbs */}
            <motion.div
              animate={{
                x: [0, 100, 0],
                y: [0, 50, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"
            />
            <motion.div
              animate={{
                x: [0, -80, 0],
                y: [0, -60, 0],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute bottom-20 right-10 w-40 h-40 bg-purple-300/20 rounded-full blur-2xl"
            />
            <motion.div
              animate={{
                x: [0, 50, 0],
                y: [0, -40, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-1/2 right-20 w-24 h-24 bg-indigo-300/15 rounded-full blur-2xl"
            />

            {/* Content */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="relative mb-8"
            >
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-4 border-white/30 border-t-white/80 border-r-white/80"
                />
                <img
                  src="/images/corpHubv2.png"
                  alt="CorpHub Logo"
                  className="relative max-h-48 w-auto drop-shadow-2xl"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center space-y-6"
            >
              <div>
                <h1 className="text-4xl font-bold mb-3">
                  Chào mừng trở lại!
                </h1>
                <p className="text-lg text-white/90">
                  Đăng nhập để truy cập hệ thống quản lý doanh nghiệp
                </p>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                {[
                  {icon: Shield, label: "Bảo mật cao" },
                  {icon: Zap, label: "Nhanh chóng" },
                  {icon: Sparkles, label: "Hiện đại" },
                  {icon: TrendingUp, label: "Hiệu quả" },
                ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + idx * 0.1 }}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20"
                >
                  <feature.icon className="w-6 h-6" />
                  <span className="text-sm font-semibold">{feature.label}</span>
                </motion.div>
                ))}
              </div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="flex justify-center gap-8 pt-6 border-t border-white/20"
              >
                {[
                  {value: "1000+", label: "Người dùng" },
                  {value: "50+", label: "Doanh nghiệp" },
                  {value: "99.9%", label: "Uptime" },
                ].map((stat, idx) => (
                  <div key={idx} className="text-center">
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-white/70">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Decorative elements */}
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [0, 5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-10 right-10 opacity-20"
            >
              <Sparkles className="w-16 h-16" />
            </motion.div>
            <motion.div
              animate={{
                y: [0, 10, 0],
                rotate: [0, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute bottom-10 left-10 opacity-20"
            >
              <Shield className="w-20 h-20" />
            </motion.div>
          </div>

          {/* Right: Form section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="w-full lg:w-1/2 p-12 bg-white dark:bg-gray-800"
          >
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                Đăng nhập
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Nhập thông tin tài khoản của bạn
              </p>
            </div>

            <LoginForm loading={loading} error={error} />

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700"
            >
              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                © 2024 CorpHub. All rights reserved.
              </p>
              <div className="flex justify-center gap-4 mt-3">
                <a href="#" className="text-xs text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                  Điều khoản
                </a>
                <span className="text-gray-300 dark:text-gray-700">•</span>
                <a href="#" className="text-xs text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                  Bảo mật
                </a>
                <span className="text-gray-300 dark:text-gray-700">•</span>
                <a href="#" className="text-xs text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                  Hỗ trợ
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom branding */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6"
        >
          Powered by <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">CorpHub Enterprise</span>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
