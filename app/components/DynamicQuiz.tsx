'use client';

import { useState } from 'react';
import { useGeneratedQuestions } from '../hooks/useGeneratedQuestions';

// Simple quiz component using AI-generated questions
export default function DynamicQuiz() {
  const [userId] = useState(`user-${Math.random().toString(36).substring(2, 9)}`);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  // Use our custom hook to fetch AI-generated questions
  const { questions, loading, error } = useGeneratedQuestions(userId);

  // Handle when user selects an answer
  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    
    // Check if answer is correct
    if (answer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  // Move to next question or show results
  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
    }
  };

  // Reset quiz
  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-xl font-semibold mb-4">Loading AI-generated questions...</div>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  // Error state
  if (error || !questions || questions.length === 0) {
    return (
      <div className="p-6 bg-red-50 rounded-lg">
        <h2 className="text-xl font-bold text-red-700">Error Loading Questions</h2>
        <p className="mt-2">{error || "No questions available"}</p>
        <button 
          type="button"
          onClick={handleRestart}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Result screen
  if (showResult) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Quiz Results</h2>
        <p className="text-xl mb-4">
          You scored {score} out of {questions.length}
        </p>
        <button
          type="button"
          onClick={handleRestart}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Take New Quiz
        </button>
        <p className="mt-4 text-sm text-gray-500">
          Each time you take the quiz, new AI-generated questions will be provided.
        </p>
      </div>
    );
  }

  // Quiz question screen
  const question = questions[currentQuestion];
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="mb-4">
        <span className="text-sm text-gray-500">
          Question {currentQuestion + 1}/{questions.length}
        </span>
      </div>
      
      <h2 className="text-xl font-semibold mb-4">{question.question}</h2>
      
      <div className="space-y-3 mb-6">
        {question.options.map((option) => (
          <button
            key={`${currentQuestion}-${option}`}
            type="button"
            onClick={() => handleAnswerSelect(option)}
            className={`w-full text-left p-3 rounded-md ${
              selectedAnswer === option
                ? option === question.correctAnswer
                  ? 'bg-green-100 border border-green-500'
                  : 'bg-red-100 border border-red-500'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            disabled={selectedAnswer !== null}
          >
            {option}
          </button>
        ))}
      </div>
      
      {selectedAnswer && (
        <div className="mb-4">
          {selectedAnswer === question.correctAnswer ? (
            <p className="text-green-600 font-medium">Correct!</p>
          ) : (
            <p className="text-red-600 font-medium">
              Incorrect. The correct answer is {question.correctAnswer}.
            </p>
          )}
        </div>
      )}
      
      <button
        type="button"
        onClick={handleNext}
        disabled={selectedAnswer === null}
        className={`px-4 py-2 rounded-md ${
          selectedAnswer === null
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {currentQuestion < questions.length - 1 ? 'Next Question' : 'Show Results'}
      </button>
    </div>
  );
} 