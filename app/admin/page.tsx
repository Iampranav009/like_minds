'use client';

import { useState, useEffect } from 'react';
import { getOAuthUrl } from '@/lib/googleSheets';

export default function AdminPage() {
  const [authUrl, setAuthUrl] = useState('');

  useEffect(() => {
    // Get the OAuth URL
    const url = getOAuthUrl();
    setAuthUrl(url);
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-black text-white">
      <div className="max-w-lg w-full p-8 bg-gray-900 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
          Admin - Google Sheets Setup
        </h1>
        
        <p className="mb-4 text-gray-300">
          Connect this application to Google Sheets to store user registration data.
        </p>
        
        <p className="mb-8 text-gray-300">
          Click the button below to authenticate with Google and grant permission to access your spreadsheet.
        </p>
        
        <div className="flex justify-center">
          <a
            href={authUrl}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-blue-500/20 hover:scale-105 transition-all duration-300 flex items-center"
          >
            <svg 
              className="w-5 h-5 mr-2" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M22.5006 12.2332C22.5006 11.3699 22.4291 10.7399 22.2744 10.0865H12.2148V13.9832H18.1196C18.0006 14.9515 17.3577 16.4099 15.9291 17.3898L15.9091 17.5203L19.0897 19.935L19.3101 19.9565C21.3338 18.1249 22.5006 15.4298 22.5006 12.2332Z" 
                fill="#4285F4"
              />
              <path 
                d="M12.214 22.5C15.1068 22.5 17.5353 21.5667 19.3092 19.9567L15.9282 17.39C15.0235 18.0083 13.8092 18.4417 12.214 18.4417C9.38069 18.4417 6.97596 16.6083 6.11874 14.0767L5.99309 14.0871L2.68583 16.595L2.64258 16.7133C4.40446 20.1433 8.0235 22.5 12.214 22.5Z" 
                fill="#34A853"
              />
              <path 
                d="M6.12096 14.0767C5.89998 13.4233 5.77477 12.7233 5.77477 12C5.77477 11.2767 5.89998 10.5767 6.10904 9.92337L6.10306 9.78423L2.75435 7.23511L2.64479 7.28667C1.91862 8.71002 1.50195 10.3083 1.50195 12C1.50195 13.6917 1.91862 15.29 2.64479 16.7133L6.12096 14.0767Z" 
                fill="#FBBC05"
              />
              <path 
                d="M12.214 5.55833C14.2259 5.55833 15.583 6.41666 16.3569 7.14166L19.3807 4.23333C17.5283 2.51666 15.1068 1.5 12.214 1.5C8.02353 1.5 4.40447 3.85667 2.64258 7.28667L6.10683 9.92334C6.97598 7.39166 9.38069 5.55833 12.214 5.55833Z" 
                fill="#EB4335"
              />
            </svg>
            Connect with Google
          </a>
        </div>
      </div>
    </div>
  );
} 