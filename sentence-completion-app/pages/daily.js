import { useState } from 'react';

export default function DailyCompletion() {
  const [responses, setResponses] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    try {
      // Replace with the actual user ID, usually retrieved from the session
      const userId = 1; 

      const res = await fetch('/api/responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          content: responses,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessage('Response saved successfully!');
        setResponses('');
      } else {
        setMessage('Failed to save response. Please try again.');
      }
    } catch (error) {
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
