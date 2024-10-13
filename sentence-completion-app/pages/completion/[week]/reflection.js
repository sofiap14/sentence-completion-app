// /pages/completion/[week]/reflection.js

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession, signIn } from 'next-auth/react';
import axios from 'axios';

export default function ReflectionPage() {
  const router = useRouter();
  const { week } = router.query;

  const [responsesByDay, setResponsesByDay] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return; // Wait for session to load
    if (!session) {
      signIn();
      return;
    }

    if (!week) return;

    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/reflection?week=${week}`);
        console.log('Fetched reflection data:', res.data);
        setResponsesByDay(res.data.responsesByDay);
      } catch (err) {
        console.error('Error fetching reflection data:', err.response?.data || err.message);
        setError(`Error fetching reflection data: ${err.response?.data?.error || err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [week, session, status]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  // Prepare to render responses grouped by day and stem
  const sortedDates = Object.keys(responsesByDay).sort();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Week {week} Reflection</h1>

      {sortedDates.length === 0 ? (
        <p>No responses for this week.</p>
      ) : (
        sortedDates.map((date) => (
          <div key={date} className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">Date: {formatDate(date)}</h2>

            {Object.entries(responsesByDay[date]).map(([stemText, responses]) => (
              <div key={stemText} className="mb-4">
                <p className="font-semibold text-lg mb-2">{stemText}</p>
                <ul className="list-disc list-inside pl-4">
                  {responses.map((responseText, index) => (
                    <li key={index} className="mb-1">{responseText}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}

// Helper function to format dates
function formatDate(dateString) {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const dateObj = new Date(dateString);
  return dateObj.toLocaleDateString(undefined, options);
}
