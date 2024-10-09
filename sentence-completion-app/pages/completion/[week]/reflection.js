import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ReflectionPage({ week }) {
  const [stems, setStems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReflection = async () => {
    try {
      const res = await axios.get(`/api/getAllResponses?week=${week}`);
      setStems(res.data.stemsWithResponses || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching stems:', err);
      setError(err.response?.data?.error || 'Error fetching stems.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReflection();
  }, [week]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Reflection for Week {week}</h1>
      <div>
        {stems.length > 0 ? (
          stems.map((stem) => (
            <div key={stem.id}>
              <h2>{stem.text}</h2>
              <h3>Your Responses:</h3>
              {stem.responsesWithDates.length > 0 ? (
                <ul>
                  {stem.responsesWithDates.map((response) => (
                    <li key={response.id}>
                      <strong>{new Date(response.createdAt).toLocaleDateString()}:</strong> {response.responseText}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No responses submitted this week.</p>
              )}
            </div>
          ))
        ) : (
          <p>No responses available for reflection.</p>
        )}
      </div>
    </div>
  );
}
