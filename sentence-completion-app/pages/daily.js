import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

export default function DailyCompletion() {
  const { data: session, status } = useSession();
  const [responses, setResponses] = useState('');
  const [message, setMessage] = useState('');

  // Redirect unauthenticated users to the sign-in page
  useEffect(() => {
    if (status === 'unauthenticated') {
      window.location.href = '/auth/signin';
    }
  }, [status]);

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  const handleSubmit = async () => {
    try {
      if (!session) return;

      const res = await fetch('/api/responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.userId,
          content: responses,
        }),
      });

      if (res.ok) {
        setMessage('Response saved successfully!');
        setResponses('');
      } else {
        setMessage('Failed to save response. Please try again.');
      }
    } catch (error) {
      console.error('Error saving response:', error);
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Daily Sentence Completion</h1>
      <textarea
        className="w-full p-2 border rounded mb-4"
        value={responses}
        onChange={(e) => setResponses(e.target.value)}
        rows="8"
        placeholder="Complete your sentences here..."
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleSubmit}
      >
        Submit
      </button>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
