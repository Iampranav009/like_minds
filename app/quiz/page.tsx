"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import questions from '../data/questions.json';

export default function QuizPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizQuestions, setQuizQuestions] = useState<typeof questions>([]);
  const [isTimeExpired, setIsTimeExpired] = useState(false);
  const [showQuizIntro, setShowQuizIntro] = useState(true);
  const router = useRouter();

  // Memoize the question sets to prevent recreation on each render
  const firstSet = useMemo(() => questions.slice(0, 10), []);
  const secondSet = useMemo(() => questions.slice(10, 20), []);

  // Only run this effect once on component mount
  useEffect(() => {
    // Check if user has completed the quiz before
    const hasCompletedQuiz = localStorage.getItem('hasCompletedQuiz') === 'true';
    
    // Set questions based on whether user has completed the quiz before
    if (hasCompletedQuiz) {
      setQuizQuestions(secondSet);
    } else {
      setQuizQuestions(firstSet);
    }
  }, [firstSet, secondSet]);

  // Check if user has been permanently blocked due to previous failure
  useEffect(() => {
    const hasFailedBefore = localStorage.getItem('quizFailed') === 'true';
    if (hasFailedBefore) {
      // Redirect to home with message that they are blocked
      router.push('/?blocked=true');
    }
  }, [router]);

  const currentQuestion = quizQuestions.length > 0 
    ? quizQuestions[currentQuestionIndex] 
    : { question: '', options: [], correctAnswer: '' };
    
  const progress = quizQuestions.length > 0 
    ? ((currentQuestionIndex + 1) / quizQuestions.length) * 100 
    : 0;

  // Use useCallback to memoize the handleAnswerSelect function
  const handleAnswerSelect = useCallback((answer: string) => {
    // Set the selected answer immediately
    setSelectedAnswer(answer);
    
    // Store user's answer in the answers array
    const newAnswers = [];
    newAnswers[currentQuestionIndex] = answer;

    // Update score if answer is correct
    if (answer === currentQuestion.correctAnswer) {
      setScore(prevScore => prevScore + 1);
    }
    
    // No longer auto-advance - wait for Next button click
  }, [currentQuestionIndex, currentQuestion.correctAnswer]);
  
  // Add function to handle Next button click
  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setSelectedAnswer(null);
    } else {
      // Quiz completed - check if they passed (60% or more correct)
      const passThreshold = Math.ceil(quizQuestions.length * 0.6);
      const passed = score >= passThreshold;
      
      if (passed) {
        // Mark as completed and redirect to results page
        localStorage.setItem('hasCompletedQuiz', 'true');
        router.push(`/result?score=${score}`);
      } else {
        // User failed the quiz - permanently block them
        localStorage.setItem('quizFailed', 'true');
        // Redirect to the home page with failed query param
        router.push('/?failed=true');
      }
    }
  }, [currentQuestionIndex, quizQuestions.length, router, score]);

  // Reset timer and selected answer when question changes or questions are loaded
  useEffect(() => {
    // Don't start timer until questions are loaded or if intro is showing
    if (quizQuestions.length === 0 || showQuizIntro) return;

    // Reset timer and timeExpired flag when question changes
    setTimeLeft(30);
    setIsTimeExpired(false);

    // Start timer countdown
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setIsTimeExpired(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    // Cleanup timer on unmount or question change
    return () => clearInterval(timer);
  }, [quizQuestions.length, showQuizIntro]);

  // Handle timeout navigation in a separate effect
  useEffect(() => {
    if (isTimeExpired) {
      // Use setTimeout to ensure state updates complete before navigation
      const redirectTimeout = setTimeout(() => {
        router.push('/timeout');
      }, 100);
      
      return () => clearTimeout(redirectTimeout);
    }
  }, [isTimeExpired, router]);

  // Handle tab switching detection
  useEffect(() => {
    let wasHidden = false;

    const handleVisibilityChange = () => {
      // Check if the page was hidden and is now becoming visible again
      if (wasHidden && document.visibilityState === 'visible') {
        wasHidden = false;
        alert('Tab switching detected! You will be redirected to the home page.');
        // Use a small timeout to ensure the navigation happens after the tab is fully visible
        setTimeout(() => {
          window.location.href = '/';
        }, 100);
      }
      
      // Set flag when page becomes hidden
      if (document.visibilityState === 'hidden') {
        wasHidden = true;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

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

  // Show loading state while questions are being prepared
  if (quizQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-950 text-white flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500" />
        <p className="mt-4 text-indigo-300">Loading questions...</p>
      </div>
    );
  }

  // Show quiz intro popup
  if (showQuizIntro) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-950 text-white flex flex-col">
        {/* Background color accents */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-indigo-700 filter blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-purple-800 filter blur-3xl" />
            <div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-blue-700 filter blur-3xl" />
          </div>
        </div>
        
        {/* Navbar */}
        <nav className="bg-gray-900/80 backdrop-blur-md border-b border-indigo-900/30 w-full">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-600 to-purple-800 flex items-center justify-center mr-2">
                  <span className="text-white font-bold">Q</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-300 bg-clip-text text-transparent">
                  Like Minds
                </span>
              </Link>
            </div>
          </div>
        </nav>

        {/* Quiz Intro Card */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-[#141414] backdrop-blur-sm border border-indigo-900/40 rounded-xl p-6 sm:p-8 shadow-xl shadow-purple-900/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 to-purple-800" />
            <div className="absolute -right-20 -top-20 w-40 h-40 bg-indigo-600/5 rounded-full blur-xl" />
            
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-white text-center">
              Welcome to the Community Quiz
            </h1>
            
            <div className="space-y-6 mb-8">
              <div className="bg-[#1a1a1a] p-4 rounded-lg border border-indigo-900/30">
                <h2 className="text-lg font-semibold text-indigo-400 mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <title>Info icon</title>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Quiz Information
                </h2>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <title>Chevron icon</title>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span>Total Questions: {quizQuestions.length}</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <title>Chevron icon</title>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span>Time per Question: 30 seconds</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <title>Chevron icon</title>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span>If you don&apos;t answer in time, you will be redirected to the home page.</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <title>Chevron icon</title>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span>Passing Score: 60% or higher</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-[#1a1a1a] p-4 rounded-lg border border-indigo-900/30">
                <h2 className="text-lg font-semibold text-indigo-400 mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <title>Warning icon</title>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Important Rules
                </h2>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <title>Warning icon</title>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>Do not switch tabs or navigate away during the quiz.</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <title>Warning icon</title>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>If you fail the quiz, you will not be able to retake it.</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowQuizIntro(false)}
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-800 text-white font-bold rounded-lg shadow-lg hover:shadow-indigo-500/20 hover:scale-105 transition-all duration-300"
              >
                Start Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-950 text-white flex flex-col">
      {/* Background color accents */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-indigo-700 filter blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-purple-800 filter blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-blue-700 filter blur-3xl" />
        </div>
      </div>
      
      {/* Navbar */}
      <nav className="bg-gray-900/80 backdrop-blur-md border-b border-indigo-900/30 w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-600 to-purple-800 flex items-center justify-center mr-2">
                <span className="text-white font-bold">Q</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-300 bg-clip-text text-transparent">
                Like Minds
              </span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <div className="bg-gray-900/80 border border-indigo-900/30 rounded-full px-3 py-1 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-white">{currentQuestionIndex + 1} / {quizQuestions.length}</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col py-4 sm:py-8">
        {/* Progress and timer section */}
        <div className="flex flex-wrap items-center justify-between mb-4 sm:mb-8 gap-2">
          {/* Progress bar */}
          <div className="w-full sm:w-3/4 h-2 bg-indigo-900/20 rounded-full">
            <div 
              className="h-full bg-gradient-to-r from-indigo-600 to-purple-800 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }} 
            />
          </div>

          {/* Timer */}
          <div className="self-end">
            <div className="flex items-center gap-2 bg-gray-900/80 border border-indigo-900/30 rounded-full px-3 py-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-mono font-semibold text-white">{timeLeft}s</span>
            </div>
          </div>
        </div>

        {/* Question container */}
        <div className="flex-1 flex flex-col items-center justify-center py-4 sm:py-8">
          <div key={currentQuestionIndex} className="w-full max-w-2xl bg-[#141414] backdrop-blur-sm border border-indigo-900/40 rounded-xl p-4 sm:p-8 shadow-xl shadow-purple-900/10 relative overflow-hidden">
            {/* Decorative accent */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 to-purple-800" />
            <div className="absolute -right-20 -top-20 w-40 h-40 bg-indigo-600/5 rounded-full blur-xl" />
            
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 sm:mb-8 text-white">
              {currentQuestion.question}
            </h2>
            
            <div className="space-y-3 sm:space-y-4">
              {currentQuestion.options.map((option) => (
                <button
                  key={`answer-${option}`}
                  onClick={() => handleAnswerSelect(option)}
                  className={`w-full p-3 sm:p-4 rounded-lg text-left transition-all duration-200 ${
                    selectedAnswer === option
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-800 text-white shadow-lg'
                      : 'bg-[#141414] border border-indigo-900/40 text-white hover:border-indigo-500/70 hover:shadow-md hover:shadow-indigo-500/10'
                  }`}
                  disabled={selectedAnswer !== null} // Disable all buttons once an answer is selected
                  type="button"
                >
                  <div className="flex items-center">
                    <span className={`inline-block w-5 h-5 rounded-full border mr-3 flex-shrink-0 ${
                      selectedAnswer === option 
                        ? 'bg-white border-white' 
                        : 'border-indigo-500/50'
                    }`}>
                      {selectedAnswer === option && <span className="block w-full h-full rounded-full bg-indigo-600 transform scale-75" />}
                    </span>
                    <span className={`${selectedAnswer === option ? 'font-medium' : ''}`}>{option}</span>
                  </div>
                </button>
              ))}
            </div>
            
            {/* Next button - Show only when an answer is selected */}
            {selectedAnswer !== null && (
              <div className="mt-6">
                {isTimeExpired && (
                  <p className="text-orange-400 mb-2 text-center">
                    Time expired! Click Next to continue.
                  </p>
                )}
                <div className="flex justify-end">
                  <button
                    onClick={handleNextQuestion}
                    className="bg-gradient-to-r from-indigo-600 to-purple-800 hover:from-indigo-700 hover:to-purple-900 text-white font-semibold px-6 py-2 rounded-lg shadow-lg shadow-indigo-500/20 transition-all duration-200 flex items-center"
                    type="button"
                  >
                    Next
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 