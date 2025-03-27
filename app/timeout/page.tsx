"use client";

import React from 'react';
import Link from 'next/link';
import { Inter } from "next/font/google";

// Initialize the Inter font with latin subset
const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
});

export default function TimeoutPage() {
  return (
    <main className={`min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-950 text-white flex flex-col ${inter.className}`}>
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
                QuizCommunity
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#141414] backdrop-blur-sm border border-indigo-900/40 rounded-xl p-8 shadow-xl shadow-purple-900/10 text-center">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 to-purple-800" />
          
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-orange-600/20 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <title>Timer icon</title>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold mb-4 text-white">Time's Up!</h1>
          <p className="text-lg text-gray-300 mb-8">
            Better luck next time! You didn&apos;t answer the question in time.
          </p>
          
          <Link href="/">
            <button type="button" className="w-full py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-800 hover:from-indigo-700 hover:to-purple-900 text-white font-semibold rounded-lg shadow-lg transition-all duration-200">
              Return Home
            </button>
          </Link>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-900/80 backdrop-blur-md border-t border-indigo-900/30 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <Link href="/" className="flex items-center mb-4">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-600 to-purple-800 flex items-center justify-center mr-2">
                  <span className="text-white font-bold">Q</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-300 bg-clip-text text-transparent">
                  QuizCommunity
                </span>
              </Link>
              <p className="text-gray-400 text-center md:text-left">
                Connecting passionate innovators and entrepreneurs
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-8 mb-6 md:mb-0">
              <Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
              <Link href="/#about" className="text-gray-400 hover:text-white transition-colors">About</Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">Events</Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">Contact</Link>
            </div>
            
            <div className="flex space-x-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="GitHub">
                <span className="sr-only">GitHub</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Twitter">
                <span className="sr-only">Twitter</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>
          
          <div className="pt-6 mt-6 border-t border-indigo-900/30 text-center">
            <p className="text-gray-500">&copy; {new Date().getFullYear()} QuizCommunity. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
} 