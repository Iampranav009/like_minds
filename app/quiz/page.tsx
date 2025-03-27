"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import questions from '../data/questions.json';

export default function QuizPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [answers, setAnswers] = useState<string[]>([]);
  const router = useRouter();

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      // Quiz completed - redirect to results page
      router.push(`/result?score=${score}`);
    }
  }, [currentQuestionIndex, questions.length, router, score]);

  useEffect(() => {
    // Reset timer when question changes
    setTimeLeft(60);
    setSelectedAnswer(null);

    // Start timer countdown
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleNextQuestion();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    // Cleanup timer on unmount or question change
    return () => clearInterval(timer);
  }, [currentQuestionIndex, handleNextQuestion]);

  // Handle tab switching detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // User switched tabs or apps
        alert('Switching tabs is not allowed during the quiz!');
        router.push('/');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [router]);

  // Disable back button
  useEffect(() => {
    const handleBackButton = (e: PopStateEvent) => {
      e.preventDefault();
      window.history.pushState(null, '', window.location.pathname);
      alert('Please complete the quiz before navigating away.');
    };

    window.history.pushState(null, '', window.location.pathname);
    window.addEventListener('popstate', handleBackButton);

    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, []);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    
    // Store user's answer
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answer;
    setAnswers(newAnswers);

    // Update score if answer is correct
    if (answer === currentQuestion.correctAnswer) {
      setScore(prevScore => prevScore + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-4">
      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-200 rounded-full mb-8">
        <div 
          className="h-full bg-blue-500 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }} 
        />
      </div>

      {/* Timer */}
      <div className="self-end mb-4">
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-label="Timer">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-mono font-semibold text-gray-600">{timeLeft}s</span>
        </div>
      </div>

      {/* Question container */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentQuestionIndex}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl bg-white rounded-xl shadow-xl p-6 md:p-8"
          >
            <h2 className="text-xl md:text-2xl font-semibold mb-6 text-gray-800">
              {currentQuestion.question}
            </h2>
            
            <div className="space-y-3">
              {currentQuestion.options.map((option) => (
                <motion.button
                  key={`answer-${option}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswerSelect(option)}
                  className={`w-full p-4 rounded-lg text-left transition ${
                    selectedAnswer === option
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                  }`}
                >
                  {option}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Next button */}
      <div className="flex justify-center mt-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNextQuestion}
          disabled={selectedAnswer === null}
          className={`px-6 py-3 rounded-full font-semibold ${
            selectedAnswer === null
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600 shadow-md'
          }`}
        >
          {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
        </motion.button>
      </div>
    </div>
  );
} 