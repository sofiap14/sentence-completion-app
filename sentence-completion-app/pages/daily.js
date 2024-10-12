// pages/daily.js

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

export default function Daily() {
  const { data: session, status } = useSession();
  const [stems, setStems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isWeekend, setIsWeekend] = useState(false);
  const [currentStemIndex, setCurrentStemIndex] = useState(0); // Tracks current stem
  const [isSubmitting, setIsSubmitting] = useState(false); // Tracks submission state

  useEffect(() => {
    if (status === 'loading') return; // Wait for session

    // Determine if today is weekend
    const today = new Date();
    const day = today.getDay(); // 0 = Sunday, 6 = Saturday
    if (day === 0 || day === 6) {
      setIsWeekend(true);
    } else {
      setIsWeekend(false);
    }

    fetchStems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const fetchStems = async () => {
    try {
      if (isWeekend) {
        const res = await axios.get('/api/getAllResponses');
        setStems(res.data.stemsWithResponses);
      } else {
        const res = await axios.get('/api/stems');
        setStems(res.data.stems);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching stems:', err);
      setError(err.response?.data?.error || 'Error fetching stems.');
      setLoading(false);
    }
  };

  const handleSubmit = async (stemId, responseText, resetForm, setResponseMessage, setResponseError) => {
    if (!responseText.trim()) {
      setResponseError('Response cannot be empty.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await axios.post('/api/responses', {
        sentenceStemId: stemId,
        responseText: responseText.trim(),
      });

      setResponseMessage(res.data.message);
      setResponseError('');
      resetForm();

      // Refresh stems to update response counts
      await fetchStems();

      // Check if current stem has reached the limit
      const updatedStem = stems.find((stem) => stem.id === stemId);
      if (updatedStem && updatedStem.responsesToday + 1 >= 10) {
        // Move to next stem
        setCurrentStemIndex((prevIndex) => prevIndex + 1);
      }
    } catch (err) {
      console.error('Error submitting response:', err);
      setResponseError(err.response?.data?.error || 'Error submitting response.');
      setResponseMessage('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetDay = () => {
    setCurrentStemIndex(0);
    fetchStems();
  };

  if (status === 'loading' || loading) return <p className="text-center mt-8">Loading...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;
  if (!session) return <p className="text-center mt-8">Please sign in to access this page.</p>;

  if (isWeekend) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Weekend Reflection</h1>
        <div className="space-y-8">
          {stems.map((stem) => (
            <div key={stem.id} className="border p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-2">Stem {stem.order}: {stem.text}</h2>
              <div>
                <h3 className="text-lg font-medium mb-2">Your Responses:</h3>
                {stem.responsesWithDates.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {stem.responsesWithDates.map((response) => (
                      <li key={response.id}>
                        <strong>{new Date(response.createdAt).toLocaleDateString()}:</strong> {response.responseText}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600">No responses submitted this week.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // For weekdays: show one stem at a time
  const currentStem = stems[currentStemIndex];

  if (!currentStem) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Daily Sentence Completion</h1>
        <p className="text-center text-gray-700">You have completed all stems for today. Come back tomorrow for new prompts!</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Daily Sentence Completion</h1>

      <div className="border p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">Stem {currentStem.order}: {currentStem.text}</h2>
        <p className="mb-4">Responses Today: {currentStem.responsesToday} / 10</p>

        {currentStem.responsesToday < 10 ? (
          <ResponseForm
            stemId={currentStem.id}
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        ) : (
          <p className="text-red-500 font-semibold">You have reached the maximum number of responses for this stem today.</p>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => setCurrentStemIndex((prev) => Math.max(prev - 1, 0))}
          disabled={currentStemIndex === 0}
          className={`px-4 py-2 bg-gray-300 text-gray-700 rounded ${currentStemIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-400'}`}
        >
          Previous Stem
        </button>
        <button
          onClick={() => setCurrentStemIndex((prev) => Math.min(prev + 1, stems.length - 1))}
          disabled={currentStemIndex === stems.length - 1}
          className={`px-4 py-2 bg-gray-300 text-gray-700 rounded ${currentStemIndex === stems.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-400'}`}
        >
          Next Stem
        </button>
      </div>
    </div>
  );
}

// ResponseForm Component
function ResponseForm({ stemId, handleSubmit, isSubmitting }) {
  const [responseText, setResponseText] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [responseError, setResponseError] = useState('');

  const resetForm = () => {
    setResponseText('');
    setResponseMessage('');
    setResponseError('');
  };

  const onSubmit = (e) => {
    e.preventDefault(); // Prevent page reload
    handleSubmit(stemId, responseText, resetForm, setResponseMessage, setResponseError);
  };

  return (
    <form onSubmit={onSubmit}>
      <textarea
        value={responseText}
        onChange={(e) => setResponseText(e.target.value)}
        placeholder="Enter your response here..."
        className="w-full p-2 border rounded mb-2"
        rows={3}
        required
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
      {responseMessage && <p className="text-green-500 mt-2">{responseMessage}</p>}
      {responseError && <p className="text-red-500 mt-2">{responseError}</p>}
    </form>
  );
}
