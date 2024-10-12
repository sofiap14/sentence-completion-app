
// pages/index.js

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Function to toggle the dropdown menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="container mx-auto p-6 text-gray-800 bg-white font-custom min-h-screen">
      {/* Header */}
      <header className="flex justify-between items-center py-6">
        <h1 className="text-4xl font-bold">mindstems</h1>
        
        {/* Hamburger Menu for Mobile */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            type="button"
            className="text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900"
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
          >
            {/* Hamburger Icon */}
            <svg
              className="h-6 w-6 fill-current"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                // Close Icon
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                // Hamburger Icon
                <path
                  fillRule="evenodd"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-6">
          <Link href="/features" className="text-gray-600 hover:text-gray-900">
            Features
          </Link>
          <Link href="/pricing" className="text-gray-600 hover:text-gray-900">
            Pricing
          </Link>
          <Link href="/contact" className="text-gray-600 hover:text-gray-900">
            Contact
          </Link>
        </nav>
      </header>

      {/* Dropdown Menu for Mobile */}
      {isMenuOpen && (
        <nav className="md:hidden mb-4">
          <ul className="space-y-2">
            <li>
              <Link
                href="/features"
                className="block text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)} // Close menu on link click
              >
                Features
              </Link>
            </li>
            <li>
              <Link
                href="/pricing"
                className="block text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="block text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      )}

      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row items-center mt-12">
        {/* Description Text */}
        <div className="md:w-1/2 ml-16">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            Unlock Your Potential with Daily Reflections
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            Engage in daily sentence completion exercises and reflect on your weekly responses to foster personal growth and self-awareness.
          </p>
          <div className="flex space-x-4">
            {/* Sign In Button */}
            <Link
              href="/auth/signin"
              className="bg-[#E2471D] text-white px-6 py-3 rounded-full hover:bg-[#C33C1A] transition duration-300"
              aria-label="Sign in to your account"
            >
              Sign In
            </Link>
            {/* Create Account Button */}
            <Link
              href="/auth/signup"
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-full hover:bg-gray-300 transition duration-300"
              aria-label="Create your free account"
            >
              Create Account
            </Link>
          </div>
        </div>
        
        {/* Image */}
        <div className="md:w-1/4 mb-8 md:mb-0 ml-28">
          <Image 
            src="/images/journal.png" 
            alt="Daily Completion Illustration" 
            width={400} 
            height={300} 
            className="rounded-xl object-cover w-full" 
          />
        </div>
      </section>
      
      {/* Informational Blocks */}
      <section className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Block 1 */}
        <div className="bg-[#E2471D] rounded-lg p-6 shadow hover:shadow-lg transition duration-300">
          <h3 className="text-2xl font-semibold mb-3">About Nathaniel Branden</h3>
          <p className="text-gray-200">
            A renowned psychotherapist and author, Nathaniel Branden&apos;s work on self-esteem has shaped personal development practices worldwide.
          </p>
        </div>

        {/* Block 2 */}
        <div className="bg-gray-100 rounded-lg p-6 shadow hover:shadow-lg transition duration-300">
          <h3 className="text-2xl font-semibold mb-3">Sentence Completion Exercise</h3>
          <p className="text-gray-600">
            Dive deep into your subconscious with our structured sentence completion exercises, designed to reveal your innermost thoughts and feelings.
          </p>
        </div>

        {/* Block 3 */}
        <div className="bg-gray-100 rounded-lg p-6 shadow hover:shadow-lg transition duration-300">
          <h3 className="text-2xl font-semibold mb-3">How Mindstems Helps You</h3>
          <p className="text-gray-600">
            Mindstems provides daily prompts and tracks your responses, ensuring consistency and fostering meaningful personal growth based on proven psychological principles.
          </p>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="mt-24 border-t pt-6 text-center text-gray-500">
        &copy; {new Date().getFullYear()} Mindstems. All rights reserved.
      </footer>
    </div>
  );
}
