import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

export default function DailyCompletion() {
  const [stems, setStems] = useState([]);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // Track submission state
  const [currentStemIndex, setCurrentStemIndex] = useState(0); // Track current stem
  const router = useRouter();
  const { week, day } = router.query;
  const { data: session } = useSession(); // Fetch session data

  const fetchData = async () => {
    try {
      // Fetch stems for the current week/day
      const stemsRes = await axios.get(`/api/stems?week=${week}&day=${day}`);
      console.log('Fetched stems:', stemsRes.data);
      setStems(stemsRes.data.stems);

      // Fetch responses for the current week/day
      const responsesRes = await axios.get(`/api/responses?week=${week}&day=${day}`);
      console.log('Fetched responses:', responsesRes.data);
      setResponses(responsesRes.data);
    } catch (err) {
      console.error('Error fetching stems or responses:', err.response?.data || err.message);
      setError(`Error fetching stems or responses: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!week || !day) return;
    fetchData();
  }, [week, day]);

  // Helper function to filter responses for the current day
  const getResponsesToday = (stemId) => {
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    return responses.filter(
      (response) => response.sentenceStemId === stemId && response.createdAt.startsWith(today)
    );
  };

  const handleSubmit = async (stemId, responseText) => {
    if (!responseText.trim()) {
      setError('Response cannot be empty');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await axios.post(
        '/api/responses', 
        { stemId, responseText },
        { withCredentials: true } // Ensure credentials are sent
      );

      // Refresh stems and responses after successful submission
      await fetchData();

      // Check if the current stem has reached the limit of 10 responses per day
      const updatedStem = stems.find((stem) => stem.id === stemId);
      if (updatedStem && getResponsesToday(stemId).length >= 10) {
        setCurrentStemIndex((prevIndex) => {
          const nextIndex = prevIndex + 1;
          return nextIndex < stems.length ? nextIndex : prevIndex; // Move to next stem if exists
        });
      }

      setError('');
    } catch (err) {
      console.error('Error submitting response:', err);
      setError('Failed to submit response');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const currentStem = stems[currentStemIndex];

  if (!currentStem) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Daily Sentence Completion</h1>
        <p className="text-center text-gray-700">You have completed all stems for today. Come back tomorrow for new prompts!</p>
      </div>
    );
  }

  const responsesToday = getResponsesToday(currentStem.id); // Get responses for the current stem today

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Daily Sentence Completion</h1>

      <div className="border p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">Stem {currentStem.order}: {currentStem.text}</h2>
        <p className="mb-4">Responses Today: {responsesToday.length} / 10</p>

        {responsesToday.length < 10 ? (
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

function ResponseForm({ stemId, handleSubmit, isSubmitting }) {
  const [responseText, setResponseText] = useState('');

  const onSubmit = (e) => {
    e.preventDefault(); // Prevent page reload
    handleSubmit(stemId, responseText);
    setResponseText(''); // Clear form after submission
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
    </form>
  );
}
