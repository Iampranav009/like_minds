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
  const firstSet = useMemo(() => questions.slice(0, 10), []); // First 10 questions for first-time users
  
  // Create function to get a random set of questions with a specific seed
  const getRandomQuestionSet = useCallback((seed: string, count: number = 10) => {
    // Create a simple hash of the seed to use as random seed
    const seedHash = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    // Create a copy of all questions
    const allQuestions = [...questions];
    
    // Fisher-Yates shuffle with seed
    for (let i = allQuestions.length - 1; i > 0; i--) {
      // Use the seed to create a "random" number
      const seedRandom = ((i * seedHash) % allQuestions.length);
      const j = Math.abs(seedRandom) % (i + 1);
      [allQuestions[i], allQuestions[j]] = [allQuestions[j], allQuestions[i]];
    }
    
    // Return the specified count of questions
    return allQuestions.slice(0, count);
  }, []);

  // Only run this effect once on component mount
  useEffect(() => {
    // Generate or get a user ID to use as seed
    let userId = localStorage.getItem('quizUserId');
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem('quizUserId', userId);
    }
    
    // Check if user has completed the quiz before
    const hasCompletedQuiz = localStorage.getItem('hasCompletedQuiz') === 'true';
    
    // Get a random set of questions based on user ID
    const userQuestions = getRandomQuestionSet(userId);
    setQuizQuestions(userQuestions);
    
  }, [getRandomQuestionSet]);

  // Check if user has been permanently blocked due to previous failure
  useEffect(() => {
    // Remove permanent blocking functionality
    // const hasFailedBefore = localStorage.getItem('quizFailed') === 'true';
    // if (hasFailedBefore) {
    //   // Redirect to home with message that they are blocked
    //   router.push('/?blocked=true');
    // }
  }, []); // Empty dependency array since we're not using router anymore

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
      // Reset timer when moving to next question
      setTimeLeft(30);
      setIsTimeExpired(false);
    } else {
      // Quiz completed - check if they passed (60% or more correct)
      const passThreshold = Math.ceil(quizQuestions.length * 0.6);
      const passed = score >= passThreshold;
      
      if (passed) {
        // Mark as completed and redirect to results page
        localStorage.setItem('hasCompletedQuiz', 'true');
        router.push(`/result?score=${score}`);
      } else {
        // User failed the quiz - redirect to try next time page
        // No longer permanently block the user
        router.push('/try-again');
      }
    }
  }, [currentQuestionIndex, quizQuestions.length, router, score]);

  // Reset timer when question changes
  useEffect(() => {
    // Don't reset timer if questions not loaded or intro is showing
    if (quizQuestions.length === 0 || showQuizIntro) return;
    
    // Reset timer when question changes
    setTimeLeft(30);
    setIsTimeExpired(false);
    // We need currentQuestionIndex in the dependencies array to reset the timer when the question changes,
    // even though the linter suggests it might be unnecessary
  }, [currentQuestionIndex, quizQuestions.length, showQuizIntro]);

  // Handle timer countdown
  useEffect(() => {
    // Don't start timer until questions are loaded or if intro is showing
    if (quizQuestions.length === 0 || showQuizIntro) return;
    
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

    // Cleanup timer on unmount
    return () => clearInterval(timer);
  }, [quizQuestions.length, showQuizIntro]); // Removed currentQuestionIndex from dependencies

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
                    <span>Total Questions: 10</span>
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
              <div className="hidden md:flex space-x-3 mr-4">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-white transition-colors" aria-label="GitHub">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-white transition-colors" aria-label="Instagram">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-white transition-colors" aria-label="YouTube">
                  <span className="sr-only">YouTube</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
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