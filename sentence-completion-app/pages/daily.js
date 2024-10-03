// /pages/daily.js

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
  const MAX_RESPONSES = 10;

  // Redirect unauthenticated users to the sign-in page
  useEffect(() => {
    if (status === 'loading') return; // Do nothing while loading
    if (!session) {
      router.push('/auth/signin');
    }
  }, [status, session, router]);

  // Fetch stems
  useEffect(() => {
    const fetchStems = async () => {
      try {
        const res = await fetch('/api/stems', {
          credentials: 'include',
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to fetch stems.');
        }
        const data = await res.json();
        console.log('Fetched stems:', data.stems);
        console.log('Current week number:', data.weekNumber);
        setStems(data.stems);
        setWeekNumber(data.weekNumber);
      } catch (error) {
        console.error('Error fetching stems:', error);
        setMessage(error.message);
      }
    };

    if (session) {
      fetchStems();
    }
  }, [session]);

  // Log session data
  useEffect(() => {
    console.log('Session data on the client:', session);
  }, [session]);

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

  const currentStem = stems[currentStemIndex];

  // Get existing responses for the current stem
  const existingResponses = currentStem.responses;

  // Check if user has reached max responses for this stem
  const hasReachedMaxResponses = existingResponses.length >= MAX_RESPONSES;

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
        credentials: 'include', // Include credentials to send cookies
        body: JSON.stringify({
          responseText,
          sentenceStemId: currentStem.id,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to save response.');
      }

      setResponseText('');
      setMessage('Response submitted successfully!');
      console.log('Response submitted successfully.');

      // Refresh stems to include the new response
      const updatedStemsRes = await fetch('/api/stems', {
        credentials: 'include',
      });
      const updatedStemsData = await updatedStemsRes.json();
      setStems(updatedStemsData.stems);
      setWeekNumber(updatedStemsData.weekNumber);

      // Update existing responses after submission
      const updatedCurrentStem = updatedStemsData.stems[currentStemIndex];
      const updatedResponsesCount = updatedCurrentStem.responses.length;

      if (updatedResponsesCount >= MAX_RESPONSES) {
        setMessage(`You have reached the maximum of ${MAX_RESPONSES} responses for this stem.`);
      }
    } catch (error) {
      console.error('Error submitting response:', error);
      setMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextStem = () => {
    if (currentStemIndex < stems.length - 1) {
      setCurrentStemIndex(currentStemIndex + 1);
      setResponseText('');
      setMessage('');
    } else {
      setMessage('You have completed all stems for this week. Well done!');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Daily Sentence Completion - Week {weekNumber}</h1>

      {/* Current Stem */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Stem {currentStem.order}:</h2>
        <p className="font-semibold">{currentStem.text}</p>
      </div>

      {/* Existing Responses */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Your Responses ({existingResponses.length}/{MAX_RESPONSES}):</h3>
        <ul className="list-disc ml-6">
          {existingResponses.map((resp) => (
            <li key={resp.id} className="mb-2">
              {resp.responseText}
            </li>
          ))}
        </ul>
      </div>

      {/* New Response Form */}
      {!hasReachedMaxResponses && (
        <div className="mb-4">
          <textarea
            className="w-full p-2 border rounded mt-2"
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
            rows="4"
            placeholder="Enter your response here..."
          />
        </div>
      )}

      {/* Submit Button */}
      {!hasReachedMaxResponses && (
        <button
          className={`bg-blue-500 text-white px-4 py-2 rounded ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Response'}
        </button>
      )}

      {/* Message */}
      {message && <p className="mt-4 text-red-500">{message}</p>}

      {/* Next Stem Button */}
      {hasReachedMaxResponses && (
        <button
          className="bg-green-500 text-white px-4 py-2 rounded mt-4"
          onClick={handleNextStem}
        >
          Next Stem
        </button>
      )}
    </div>
  );
}
