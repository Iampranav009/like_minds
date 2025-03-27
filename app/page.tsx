import { Inter } from "next/font/google";
import Link from "next/link";
import { motion } from "framer-motion";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-blue-500 to-teal-400">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md p-8 rounded-xl backdrop-blur-md bg-white/20 shadow-xl border border-white/30"
      >
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className={`${inter.className} text-4xl font-bold text-white text-center mb-6`}
        >
          Knowledge Quiz
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-white/90 text-center mb-8"
        >
          Test your knowledge with our interactive quiz and join our community of learners!
        </motion.p>
        
        <motion.div 
          className="flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <Link href="/quiz">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-white text-purple-600 font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Start Quiz
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
