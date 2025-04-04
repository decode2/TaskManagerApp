import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const SuccessAnimation = ({ message = "Success!", redirectTo = "/" }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate(redirectTo);
    }, 1500);
    return () => clearTimeout(timeout);
  }, [navigate, redirectTo]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-gray-900 via-purple-900 to-indigo-900 dark:from-black dark:via-gray-800 dark:to-gray-900">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="flex flex-col items-center justify-center bg-white dark:bg-slate-800 rounded-2xl p-10 shadow-2xl"
      >
        <CheckCircle2 size={64} className="text-green-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {message}
        </h2>
      </motion.div>
    </div>
  );
};

export default SuccessAnimation;
