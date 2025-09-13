import { useSelector } from "react-redux";
import LoginForm from "../components/LoginForm";
import { motion } from "framer-motion";

const LoginPage = () => {
  const { loading, error } = useSelector((state) => state.auth);

  return (
    <div
      className="relative flex justify-center items-center h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/images/background.jpg')" }}
    >

      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative w-full max-w-4xl px-4"
      >
        <div className="rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
          {/* Left: Logo section (glassmorphism) */}
          <div className="flex items-center justify-center md:w-1/2 p-8 backdrop-blur-xl bg-white-900 border-r border-white/30">
            <img
              src="/images/corpHubv2.png"
              alt="CorpHub Logo"
              className="max-h-96 w-auto drop-shadow-2xl"
            />
          </div>

          {/* Right: Form section (white background) */}
          <div className="w-full md:w-1/2 p-8 bg-white">
            <LoginForm loading={loading} error={error} />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
