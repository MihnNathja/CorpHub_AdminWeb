import { useNavigate } from "react-router-dom";
import { WrenchScrewdriverIcon, RocketLaunchIcon, SparklesIcon, ArrowLeftIcon, BellAlertIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

const FeatureComingSoonPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-2xl w-full"
      >
        {/* Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Header with animated gradient */}
          <div className="relative bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 p-12 text-center overflow-hidden">
            <div className="absolute inset-0 bg-black/5" />

            {/* Animated background elements */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
                opacity: [0.2, 0.3, 0.2],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute top-0 left-0 w-32 h-32 bg-white/20 rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                rotate: [360, 180, 0],
                opacity: [0.15, 0.25, 0.15],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute bottom-0 right-0 w-40 h-40 bg-white/20 rounded-full blur-3xl"
            />

            {/* Floating icons animation */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                animate={{
                  y: [-20, 20, -20],
                  x: [-10, 10, -10],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-10 left-10"
              >
                <SparklesIcon className="w-8 h-8 text-white/30" />
              </motion.div>
              <motion.div
                animate={{
                  y: [20, -20, 20],
                  x: [10, -10, 10],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-20 right-20"
              >
                <RocketLaunchIcon className="w-10 h-10 text-white/20" />
              </motion.div>
              <motion.div
                animate={{
                  y: [15, -15, 15],
                  x: [-15, 15, -15],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute bottom-10 left-1/4"
              >
                <BellAlertIcon className="w-7 h-7 text-white/25" />
              </motion.div>
            </div>

            {/* Main icon */}
            <motion.div
              initial={{ rotate: -10, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{
                delay: 0.2,
                type: "spring",
                stiffness: 200,
                damping: 10
              }}
              className="relative inline-flex items-center justify-center mb-6"
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 bg-white/40 rounded-full blur-2xl"
              />
              <div className="relative bg-white/30 backdrop-blur-sm rounded-full p-8 border-4 border-white/50 shadow-2xl">
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <WrenchScrewdriverIcon className="w-20 h-20 text-white drop-shadow-lg" />
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="relative text-4xl font-bold text-white mb-3 drop-shadow-lg">
                Coming Soon
              </h1>
              <p className="relative text-white/95 text-lg font-medium">
                We're building something amazing!
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
              {/* Info box */}
              <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-5 rounded-xl">
                <div className="flex items-start gap-3">
                  <RocketLaunchIcon className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-amber-900 dark:text-amber-100 mb-2">
                      Feature Under Development
                    </h3>
                    <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
                      We're working hard to bring you this exciting new feature. Our team is actively developing and testing to ensure the best experience for you. Stay tuned!
                    </p>
                  </div>
                </div>
              </div>

              {/* What to expect */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
                  <SparklesIcon className="w-4 h-4" />
                  What to Expect
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      emoji: "⚡",
                      text: "Lightning-fast performance"
                    },
                    {
                      emoji: "🎨",
                      text: "Beautiful modern design"
                    },
                    {
                      emoji: "🔒",
                      text: "Enhanced security"
                    },
                    {
                      emoji: "📱",
                      text: "Mobile-friendly interface"
                    },
                  ].map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + idx * 0.1 }}
                      className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm"
                    >
                      <span className="text-2xl">{item.emoji}</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {item.text}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 rounded-xl p-5 border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-amber-200 dark:bg-amber-800">
                    <BellAlertIcon className="w-5 h-5 text-amber-700 dark:text-amber-300" />
                  </div>
                  <h4 className="text-sm font-bold text-amber-900 dark:text-amber-100">
                    Stay Updated
                  </h4>
                </div>
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  We'll notify you as soon as this feature becomes available. Check back regularly for updates!
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(-1)}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  <ArrowLeftIcon className="w-5 h-5" />
                  Go Back
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/")}
                  className="flex-1 px-6 py-3.5 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-xl border-2 border-gray-200 dark:border-gray-600 transition-all"
                >
                  Back to Home
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Footer */}
          <div className="px-8 py-4 bg-gradient-to-r from-gray-50 to-amber-50 dark:from-gray-900/50 dark:to-amber-900/20 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-center text-gray-600 dark:text-gray-400">
              Have questions? Contact us at{" "}
              <a href="mailto:support@corpHub.com" className="text-amber-600 dark:text-amber-400 hover:underline font-semibold">
                support@corpHub.com
              </a>
            </p>
          </div>
        </div>

        {/* Bottom text with animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-6 space-y-2"
        >
          <motion.p
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="text-sm text-gray-600 dark:text-gray-400 font-medium"
          >
            🚀 Launching soon...
          </motion.p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            © 2024 CorpHub. All rights reserved.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default FeatureComingSoonPage;
