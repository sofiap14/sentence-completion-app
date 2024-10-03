import Link from 'next/link';

export default function Home() {
  return (
    <div className="container w-screen h-screen mx-auto p-4 text-white bg-gradient-to-b from-[#2F0E1F] to-[#643045]">
      <div className="flex flex-col items-center mt-4 mb-4"><h1 className="text-5xl font-serif">mindstems</h1></div>
      <div className="flex mt-24 pl-36"><p className='text-2xl font-light font-sans'>Complete your daily sentence completion exercises, <br/> reflect every weekend on your week's responses</p></div>
      
      {/* <Link href="/daily" legacyBehavior>
        <a className="bg-blue-500 text-white px-4 py-2 rounded mt-4 inline-block">
          Start Daily Completion
        </a>
      </Link> */}
      
      <div className="pl-36 mt-8 flex gap-4">
        <Link href="/auth/signin" legacyBehavior>
          <a className="bg-[#E2471D] text-white font-medium px-12 py-3 rounded-3xl hover:bg-[#9e2f12] hover:text-gray-100 transition duration-300">
            Sign In
          </a>
        </Link>
        <Link href="/auth/signup" legacyBehavior>
          <a className="bg-gray-300 text-black px-12 py-3 rounded-3xl font-medium hover:bg-[#71906e] transition duration-300">
            Create your free account
          </a>
        </Link>
      </div>
    </div>
  );
}
