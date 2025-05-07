'use client';

import Link from 'next/link';

export default function AuthSuccessPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-black text-white">
      <div className="max-w-lg w-full p-8 bg-gray-900 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
          Authentication Successful
        </h1>
        
        <p className="mb-4 text-gray-300">
          Google Sheets has been successfully connected to your application.
        </p>
        
        <p className="mb-8 text-gray-300">
          You can now close this window and continue using the application.
          All user registration data will be saved to the Google Sheet.
        </p>
        
        <div className="flex justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-blue-500/20 hover:scale-105 transition-all duration-300"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 