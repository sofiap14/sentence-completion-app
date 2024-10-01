import { signIn } from 'next-auth/react';

export default function SignIn() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sign In</h1>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => signIn()}
      >
        Sign In
      </button>
    </div>
  );
}
