// pages/index.js

import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="container w-full h-full mx-auto p-4 text-white bg-gradient-to-b from-[#2F0E1F] to-[#643045]">
      {/* Header */}
      <div className="flex flex-col items-center mt-4 mb-4">
        <h1 className="text-5xl font-serif">mindstems</h1>
      </div>
      
      {/* Description and Image */}
      <div className="flex flex-col md:flex-row items-center mt-24 pl-4 lg:pl-36 space-y-8 md:space-y-0 md:space-x-8">
        {/* Description Text */}
        <div className="flex-1">
          <p className='hidden lg:block text-center lg:text-left text-2xl font-light font-sans'>
            Complete your daily sentence completion exercises, <br />
            reflect every weekend on your week&apos;s responses
          </p>

          <p className='block lg:hidden text-center text-2xl font-light font-sans'>
            Complete your daily sentence completion exercises, reflect on your week&apos;s responses
          </p>
          <p className='hidden md:block text-left text-md font-extralight font-sans mt-8'>
            Nathaniel Branden&apos;s Sentence Completion Exercise made convenient; <br />
            your week and sentence stem tracked for you.
          </p>
          
          {/* Shortened Text: Visible on small screens */}
          <p className='block md:hidden text-left text-md font-extralight font-sans mt-8'>
            Nathaniel Branden&apos;s Sentence Completion Exercise made convenient.
          </p>
        </div>
        
        {/* Image */}
        <div className="flex-1 pl-4 lg:pl-36">
          <Image 
            src="/images/pic.png" 
            alt="Daily Completion Illustration" 
            width={400} 
            height={300} 
            className="rounded-lg shadow-xl object-contain w-full md:w-3/4 lg:w-2/3" 
          />
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="pl-4 mt-4 lg:pl-36 flex place-content-center lg:place-content-start gap-4">
        {/* Sign In Button */}
        <Link 
          href="/auth/signin" 
          className="bg-[#E2471D] text-white font-medium px-6 lg:px-12 py-3 rounded-3xl hover:bg-[#9e2f12] hover:text-gray-100 transition duration-300 focus:outline-none focus:ring-2 focus:ring-[#9e2f12] whitespace-nowrap"
          aria-label="Sign in to your account"
        >
          Sign In
        </Link>
        
        {/* Create Account Button */}
        <Link 
          href="/auth/signup" 
          className="bg-gray-300 text-black font-medium px-4 lg:px-12 py-3 rounded-3xl hover:bg-[#71906e] transition duration-300 focus:outline-none focus:ring-2 focus:ring-[#71906e] whitespace-nowrap"
          aria-label="Create your free account"
        >
          Create your free account
        </Link>
      </div>

      <div>
      {/* Informational Blocks */}
        <div className="mt-28 mr-10 pl-4 lg:pl-36 text-pink-300">
          {/* Block 1 */}
          <div 
            className="bg-[#4A192B] rounded-lg p-6 mb-8 shadow-lg"
            data-aos="fade-up"
          >
            <h2 className="text-3xl font-semibold mb-4 text-white">About Nathaniel Branden</h2>
            <p className="text-lg font-light">
              Nathaniel Branden was a prominent psychotherapist and author who focused extensively on the psychology of self-esteem. His work has significantly influenced personal development and self-help strategies worldwide.
            </p>
          </div>

          {/* Block 2 */}
          <div 
            className="bg-[#4A192B] rounded-lg p-6 mb-8 shadow-lg"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <h2 className="text-3xl font-semibold mb-4 text-white">Sentence Completion Exercise</h2>
            <p className="text-lg font-light">
              The Sentence Completion Exercise is a powerful tool designed to help individuals explore their subconscious thoughts and feelings. By completing thought-provoking sentences, users gain deeper insights into their motivations, desires, and areas for personal growth.
            </p>
          </div>

          {/* Block 3 */}
          <div 
            className="bg-[#4A192B] rounded-lg p-6 mb-8 shadow-lg"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <h2 className="text-3xl font-semibold mb-4 text-white">How Mindstems Helps You</h2>
            <p className="text-lg font-light">
              Mindstems streamlines the Sentence Completion Exercise by providing daily prompts and tracking your responses throughout the week. This structured approach ensures consistency, fosters self-reflection, and facilitates meaningful personal development based on Nathaniel Branden's principles.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
