"use client";

import { Inter } from "next/font/google";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Globe from "../components/Globe";

// Initialize the Inter font with latin subset
const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
});

function HomeContent() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check for blocked or failed status
    if (searchParams.has('blocked')) {
      setNotificationMessage("Please try the quiz again. You can access the community after successfully completing it.");
      setShowNotification(true);
    } else if (searchParams.has('failed')) {
      setNotificationMessage("Please try the quiz again when you're ready. We look forward to having you in our community!");
      setShowNotification(true);
    } else if (searchParams.has('timeout')) {
      setNotificationMessage("Better luck next time! You didn't answer the question in time.");
      setShowNotification(true);
    }
    
    // Auto-hide notification after 10 seconds
    let timer: NodeJS.Timeout;
    if (showNotification) {
      timer = setTimeout(() => {
        setShowNotification(false);
      }, 10000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [searchParams, showNotification]);

  return (
    <main className={`min-h-screen bg-black text-white ${inter.className}`}>
      {/* Globe Background */}
      <Globe />
      
      {/* Notification Banner */}
      {showNotification && (
        <div className="fixed top-16 left-0 right-0 z-50 p-4 bg-red-900/90 backdrop-blur-md border-b border-red-700 text-white text-center">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{notificationMessage}</span>
            </div>
            <button 
              type="button" 
              className="text-red-300 hover:text-white"
              onClick={() => setShowNotification(false)}
              aria-label="Close notification"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
      
      {/* Navbar */}
      <nav className="bg-black/90 backdrop-blur-md border-b border-blue-900/30 fixed w-full z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Link href="/" className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center mr-2">
                    <span className="text-white font-bold">L</span>
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent">
                    Like Minds
                  </span>
                </Link>
              </div>
            </div>
            
            {/* Desktop menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-4">
                <Link href="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-900/20 transition-colors">
                  Home
                </Link>
                <button 
                  type="button" 
                  className="ml-4 px-4 py-2 rounded-md text-sm font-medium bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 transition-all"
                >
                  Join Community
                </button>
              </div>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                type="button"
                className="text-gray-300 hover:text-white focus:outline-none"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle navigation menu"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  {mobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black/95 border-b border-blue-900/30">
              <Link
                href="/"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-900/20 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
           
              <button
                type="button"
                className="w-full text-left mt-2 px-3 py-2 rounded-md text-base font-medium bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 transition-all"
              >
                Join Community
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-40 md:pb-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-2/3 top-1/4 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl" />
          <div className="absolute right-2/3 bottom-1/4 w-96 h-96 bg-blue-700/10 rounded-full filter blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-1">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              A Community for Entrepreneurial Spirits
            </h1>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Join a vibrant community of like-minded innovators, fooders, and passionate individuals who participate in hackathons and events to create meaningful change.
            </p>
            <div className="flex flex-wrap justify-center gap-5">
              <Link href="/quiz">
                <button 
                  type="button" 
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold rounded-lg shadow-lg hover:shadow-blue-500/20 hover:scale-105 transition-all duration-300"
                >
                  Join Community
                </button>
              </Link>
              <Link href="#about">
                <button 
                  type="button" 
                  className="px-8 py-4 bg-black border border-blue-800/30 text-white font-bold rounded-lg hover:bg-blue-900/20 transition-all duration-300"
                >
                  Learn More
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Developer Section */}
      <section className="py-16 bg-gradient-to-b from-black to-blue-950/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-black/60 backdrop-blur-md border border-blue-900/30 rounded-2xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent">Meet the Developer</h2>
                <p className="text-gray-300 mb-6">This community platform was developed with passion to create an engaging environment for entrepreneurial minds and innovators who want to make a difference.</p>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <title>Code technology</title>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    </div>
                    <span className="text-white">Built with Next.js, Tailwind CSS & TypeScript</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <title>Mobile responsive</title>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-white">Fully responsive design for all devices</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <title>Community features</title>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <span className="text-white">Community-focused features for better engagement</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="bg-black p-6 rounded-xl border border-blue-900/30 w-full max-w-sm shadow-xl shadow-blue-900/10">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">PS</span>
                  </div>
                  <h3 className="text-xl font-bold text-white text-center mb-2">Pranav Shinde</h3>
                  <p className="text-blue-300 text-center mb-4">First Year Computer Science Student</p>
                  <p className="text-gray-400 text-center mb-6">Passionate about learning new skills and entrepreneurship. Currently studying at Jawaharlal Nehru Institute of Engineering and Technology, Yavatmal.</p>
                  <div className="flex justify-center space-x-4">
                    <a href="https://github.com/Iampranav009" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center hover:bg-blue-900/60 transition-colors" aria-label="Pranav's GitHub profile">
                      <span className="sr-only">GitHub</span>
                      <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                      </svg>
                    </a>
                    <a href="https://www.linkedin.com/in/pranav-shinde-9156b630a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center hover:bg-blue-900/60 transition-colors" aria-label="Pranav's LinkedIn profile">
                      <span className="sr-only">LinkedIn</span>
                      <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </a>
                    <a href="https://www.instagram.com/iampranav_009?igsh=dzYybzU5NzR1YTEz" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center hover:bg-blue-900/60 transition-colors" aria-label="Pranav's Instagram profile">
                      <span className="sr-only">Instagram</span>
                      <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Simplified Footer */}
      <footer className="bg-black py-8 border-t border-blue-900/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <Link href="/" className="flex items-center mb-4">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center mr-2">
                  <span className="text-white font-bold">L</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent">
                  Likemind
                </span>
              </Link>
              <p className="text-gray-400 text-center md:text-left">
                Connecting passionate innovators and entrepreneurs
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-8 mb-6 md:mb-0">
              <Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
              <Link href="#about" className="text-gray-400 hover:text-white transition-colors">About</Link>
              <Link href="/quiz" className="text-gray-400 hover:text-white transition-colors">Quiz</Link>
            </div>
            
            <div className="flex space-x-4">
              <a href="https://github.com/likemind-community" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Likemind GitHub">
                <span className="sr-only">GitHub</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://www.linkedin.com/company/likemind-community/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Likemind LinkedIn">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="https://www.instagram.com/likemind_community/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Likemind Instagram">
                <span className="sr-only">Instagram</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
        
            </div>
          </div>
          
          <div className="pt-6 mt-6 border-t border-blue-900/30 text-center">
            <p className="text-gray-500">&copy; {new Date().getFullYear()} Like Minds. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

// Loading component
function HomeLoading() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500" />
      <p className="mt-4 text-blue-300">Loading...</p>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<HomeLoading />}>
      <HomeContent />
    </Suspense>
  );
}

