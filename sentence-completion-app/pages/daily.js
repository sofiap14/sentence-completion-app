import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function DailyCompletion() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stems, setStems] = useState([]);
  const [currentStemIndex, setCurrentStemIndex] = useState(0);
  const [responseText, setResponseText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [weekNumber, setWeekNumber] = useState(1);

  // Redirect unauthenticated users to the sign-in page
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  // Fetch stems
  useEffect(() => {
    const fetchStems = async () => {
      try {
        const res = await fetch('/api/stems', {
          credentials: 'include',
        });
        const data = await res.json();
        setStems(data.stems);
        setWeekNumber(data.weekNumber);
      } catch (error) {
        console.error('Error fetching stems:', error);
      }
    };

    fetchStems();
  }, []);

  if (status === 'loading' || !session) {
    return <p>Loading...</p>;
  }

  if (stems.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Daily Sentence Completion</h1>
        <p>No exercises available for this week. Please check back later!</p>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!responseText.trim()) {
      setMessage('Please enter your response.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          responseText,
          sentenceStemId: stems[currentStemIndex].id,
        }),
      });

      if (res.ok) {
        setResponseText('');
        setCurrentStemIndex(currentStemIndex + 1);
        setMessage('');
      } else {
        const errorData = await res.json();
        setMessage(errorData.error || 'Failed to save response. Please try again.');
      }
    } catch (error) {
      console.error('Error saving response:', error);
      setMessage('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (currentStemIndex >= stems.length) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Daily Sentence Completion</h1>
        <p>Thank you for completing today's exercise!</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Daily Sentence Completion - Week {weekNumber}</h1>
      <div className="mb-4">
        <p className="font-semibold">{stems[currentStemIndex]?.text}</p>
        <textarea
          className="w-full p-2 border rounded mt-2"
          value={responseText}
          onChange={(e) => setResponseText(e.target.value)}
          rows="4"
          placeholder="Enter your response here..."
        />
      </div>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
      {message && <p className="mt-4 text-red-500">{message}</p>}
    </div>
  );
}
