import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Welcome to Your Sentence Completion App</h1>
      <p>This app helps you improve self-esteem with daily sentence completion exercises.</p>
      
      <Link href="/daily" legacyBehavior>
        <a className="bg-blue-500 text-white px-4 py-2 rounded mt-4 inline-block">
          Start Daily Completion
        </a>
      </Link>
      
      <div className="mt-8">
        <Link href="/auth/signup" legacyBehavior>
          <a className="mr-4 text-blue-500 underline">Sign Up</a>
        </Link>
        <Link href="/auth/signin" legacyBehavior>
          <a className="text-blue-500 underline">Sign In</a>
        </Link>
      </div>
    </div>
  );
}
