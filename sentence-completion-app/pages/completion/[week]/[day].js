import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function DailyCompletion() {
  const [stems, setStems] = useState([]);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const { week, day } = router.query;

  useEffect(() => {
    if (!week || !day) return;

    const fetchData = async () => {
      try {
        // Fetch stems for the current week/day
        const stemsRes = await axios.get(`/api/stems?week=${week}&day=${day}`);
        console.log('Fetched stems:', stemsRes.data); // Debug log
        setStems(stemsRes.data);

        // Fetch responses for the current week/day
        const responsesRes = await axios.get(`/api/responses?week=${week}&day=${day}`);
        console.log('Fetched responses:', responsesRes.data); // Debug log
        setResponses(responsesRes.data);
      } catch (err) {
        console.error('Error fetching stems or responses:', err.response?.data || err.message);
        setError(`Error fetching stems or responses: ${err.response?.data?.error || err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [week, day]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const allResponsesSubmitted = responses.length === stems.length && stems.length > 0;

  if (allResponsesSubmitted) {
    return (
      <p className="text-center">
        You have completed all stems for today. Come back tomorrow for new prompts!
      </p>
    );
  }

  return (
    <div>
      <h1>Daily Sentence Completion</h1>
      {stems.map((stem, index) => (
        <div key={stem.id} className="stem">
          <p>{stem.text}</p>
          {!responses.some(response => response.stemId === stem.id) && (
            <ResponseForm stemId={stem.id} />
          )}
        </div>
      ))}
    </div>
  );
}

function ResponseForm({ stemId }) {
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!response.trim()) {
      setError('Response cannot be empty');
      return;
    }

    try {
      const res = await axios.post('/api/responses', {
        stemId,
        responseText: response,
      });

      setSuccess('Response submitted successfully');
      setResponse('');
    } catch (err) {
      setError('Failed to submit response');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={response}
        onChange={(e) => setResponse(e.target.value)}
        placeholder="Enter your response"
        required
      />
      <button type="submit">Submit</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </form>
  );
}
