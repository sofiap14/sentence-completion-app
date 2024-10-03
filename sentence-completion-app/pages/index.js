// pages/index.js

import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="container w-screen h-screen mx-auto p-4 text-white bg-gradient-to-b from-[#2F0E1F] to-[#643045]">
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
    </div>
  );
}
