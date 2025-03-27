"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Confetti from 'react-confetti';

export default function ResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });
  
  const score = Number.parseInt(searchParams.get('score') || '0', 10);
  const totalQuestions = 10;
  const isPassed = score >= 7;

  useEffect(() => {
    // Prevent users from directly accessing this page without a score
    if (!searchParams.has('score')) {
      router.push('/');
    }

    // Update window size for confetti
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      {isPassed && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={500} />}

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-md w-full"
      >
        <div className="p-8">
          <h1 className="text-3xl font-bold text-center mb-6">
            {isPassed ? '🎉 Congratulations!' : '😔 Better Luck Next Time'}
          </h1>

          <div className="flex justify-center mb-8">
            <div className="w-36 h-36 rounded-full bg-gray-100 flex items-center justify-center">
              <div className="text-center">
                <p className="text-4xl font-bold text-indigo-600">{score}/{totalQuestions}</p>
                <p className="text-gray-500 mt-1">Score</p>
              </div>
            </div>
          </div>

          <p className="text-center text-gray-600 mb-8">
            {isPassed
              ? 'Great job! You have passed the quiz and can now join our community.'
              : 'You need at least 7 correct answers to pass. Don\'t worry, you can try again!'}
          </p>

          <div className="flex justify-center">
            {isPassed ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-300"
              >
                Join Community
              </motion.button>
            ) : (
              <Link href="/quiz">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ x: 0 }}
                  animate={{ x: [0, -10, 10, -10, 10, 0] }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="px-6 py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Try Again
                </motion.button>
              </Link>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
} 