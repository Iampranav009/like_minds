"use client";

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-950 text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#141414] border border-indigo-900/40 rounded-xl p-6 shadow-xl shadow-purple-900/10 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-600/10 mb-4 mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <title>Not found icon</title>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Page Not Found</h1>
        <p className="text-gray-400 mb-6">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link href="/" 
          className="py-2 px-6 bg-gradient-to-r from-indigo-600 to-purple-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-indigo-500/20 hover:scale-105 transition-all duration-300 inline-block">
          Return Home
        </Link>
      </div>
    </div>
  );
} 