"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import type { ChangeEvent, FormEvent } from 'react';

function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const score = Number.parseInt(searchParams.get('score') || '0', 10);
  const totalQuestions = 10;
  const isPassed = score >= 7;
  
  // Form state
  const [step, setStep] = useState(1); // 1: Congrats, 2: Form, 3: Done
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    gender: '',
    branch: '',
    interests: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Prevent users from directly accessing this page without a score
    if (!searchParams.has('score')) {
      router.push('/');
    }
    
    // Redirect if they failed
    if (!isPassed && searchParams.has('score')) {
      router.push('/?failed=true');
    }
  }, [router, searchParams, isPassed]);
  
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      // Show loading state
      setIsSubmitting(true);
      
      // Send form data to the API
      const response = await fetch('/api/submit-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        // Save form data locally for backup
        localStorage.setItem('userFormData', JSON.stringify(formData));
        // Go to final step
        setStep(3);
      } else {
        setError(result.error || 'Failed to submit registration. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleNext = () => {
    setStep(prev => prev + 1);
  };

  // Render different step content
  const renderContent = () => {
    switch(step) {
      case 1: // Congratulations page
        return (
          <>
            <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              🎉 Congratulations!
            </h1>

            <div className="flex justify-center mb-6 sm:mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full opacity-20 blur-sm" />
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-black/80 backdrop-blur-sm border border-blue-900/30 flex items-center justify-center relative">
                  <div className="text-center">
                    <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent">{score}/{totalQuestions}</p>
                    <p className="text-sm sm:text-base text-gray-300 mt-1">Score</p>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-center text-gray-300 text-sm sm:text-base mb-6 sm:mb-8">
              Great job! You have passed the quiz. Please complete the registration form to join our community.
            </p>

            <div className="flex justify-center">
              <button
                onClick={handleNext}
                type="button"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-blue-500/20 hover:scale-105 transition-all duration-300 flex items-center justify-center"
              >
                Continue to Registration
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </>
        );
        
      case 2: // Form page
        return (
          <>
            <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Complete Registration
            </h1>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-500/20 border border-red-800 rounded-md text-red-200 text-sm mb-4">
                  {error}
                </div>
              )}
              
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md bg-black/40 border border-blue-900/50 focus:border-blue-500 focus:ring focus:ring-blue-500/20 text-white px-3 py-2"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label htmlFor="number" className="block text-sm font-medium text-gray-300">Phone Number</label>
                <input
                  type="tel"
                  id="number"
                  name="number"
                  value={formData.number}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md bg-black/40 border border-blue-900/50 focus:border-blue-500 focus:ring focus:ring-blue-500/20 text-white px-3 py-2"
                  placeholder="Enter your phone number"
                />
              </div>
              
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-300">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md bg-black/40 border border-blue-900/50 focus:border-blue-500 focus:ring focus:ring-blue-500/20 text-white px-3 py-2"
                >
                  <option value="">Select your gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="branch" className="block text-sm font-medium text-gray-300">Branch/Department</label>
                <input
                  type="text"
                  id="branch"
                  name="branch"
                  value={formData.branch}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md bg-black/40 border border-blue-900/50 focus:border-blue-500 focus:ring focus:ring-blue-500/20 text-white px-3 py-2"
                  placeholder="Enter your branch or department"
                />
              </div>
              
              <div>
                <label htmlFor="interests" className="block text-sm font-medium text-gray-300">Your Interests</label>
                <textarea
                  id="interests"
                  name="interests"
                  value={formData.interests}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md bg-black/40 border border-blue-900/50 focus:border-blue-500 focus:ring focus:ring-blue-500/20 text-white px-3 py-2"
                  placeholder="Tell us about your interests"
                  rows={3}
                />
              </div>
              
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-blue-500/20 hover:scale-105 transition-all duration-300 ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          </>
        );
        
      case 3: // Done page with WhatsApp link
        return (
          <>
            <div className="text-center">
              <div className="inline-block p-4 rounded-full bg-green-500/20 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h1 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Registration Complete!
              </h1>
              
              <p className="text-gray-300 text-sm sm:text-base mb-4">
                Thank you for registering! You can now join our WhatsApp community group.
              </p>
              
              <p className="text-green-400 text-sm mb-8 animate-pulse">
                Click the button below to join our active community! 👇
              </p>
              
              <div className="relative">
                {/* Pulsing effect */}
                <div className="absolute -inset-2 rounded-lg bg-green-500/30 animate-pulse blur-sm" />
                
                <a 
                  href="https://chat.whatsapp.com/CekUypU1w18575d46wyYHa" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center justify-center w-full sm:w-auto px-6 py-4 bg-gradient-to-r from-green-600 to-green-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-green-500/40 hover:scale-105 transition-all duration-300 text-lg"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-6 w-6 mr-3" 
                    fill="white" 
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span>Join WhatsApp Community</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-gray-950 text-white flex flex-col">
      {/* Background color accents */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-blue-700 filter blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-indigo-800 filter blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-blue-700 filter blur-3xl" />
        </div>
      </div>
      
      {/* Navbar */}
      <nav className="bg-gray-900/80 backdrop-blur-md border-b border-blue-900/30 w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-800 flex items-center justify-center mr-2">
                <span className="text-white font-bold">Q</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
                Like Minds
              </span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col items-center justify-center py-8">
        <div className="w-full max-w-md bg-[#141414] backdrop-blur-sm border border-blue-900/40 rounded-xl p-6 shadow-xl shadow-blue-900/10 relative overflow-hidden">
          {/* Decorative accent */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-800" />
          <div className="absolute -right-20 -top-20 w-40 h-40 bg-blue-600/5 rounded-full blur-xl" />
          
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<ResultLoading />}>
      <ResultContent />
    </Suspense>
  );
}

function ResultLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-gray-950 text-white flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500" />
      <p className="mt-4 text-blue-300">Loading results...</p>
    </div>
  );
}