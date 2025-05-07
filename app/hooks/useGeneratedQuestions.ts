import { useState, useEffect } from 'react';

// Define the question type
interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

/**
 * Custom hook to fetch dynamically generated questions using AI
 * @param userId - Optional user ID for personalized questions
 * @param categories - Optional categories to focus question generation
 * @returns An object containing questions, loading state, and error
 */
export function useGeneratedQuestions(
  userId?: string,
  categories?: string[]
) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        
        // Call our API endpoint
        const response = await fetch('/api/generate-questions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            categories,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate questions');
        }

        const data = await response.json();
        setQuestions(data.questions);
      } catch (err) {
        console.error('Error fetching generated questions:', err);
        setError('Failed to load questions. Please try again.');
        
        // Fallback to static questions if available
        try {
          const staticQuestions = await import('@/app/data/questions.json');
          // Select random questions from the static set
          const randomQuestions = [...staticQuestions]
            .sort(() => 0.5 - Math.random())
            .slice(0, 5);
          setQuestions(randomQuestions);
        } catch (fallbackErr) {
          console.error('Error loading fallback questions:', fallbackErr);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [userId, categories]);

  return { questions, loading, error };
} 