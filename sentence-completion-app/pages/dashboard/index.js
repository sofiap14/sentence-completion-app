import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const [progress, setProgress] = useState(null);
  const [nextTask, setNextTask] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function fetchProgress() {
      const res = await fetch('/api/progress');
      const data = await res.json();
      setProgress(data);

      // Determine what the next task is based on their progress
      const today = new Date();
      const dayOfWeek = today.getDay(); // 0 (Sunday) - 6 (Saturday)
      const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5; // Monday to Friday
      const applicationDayNumber = isWeekday ? dayOfWeek : null; // 1-5 for Monday-Friday

      if (isWeekday) {
        // Weekday logic
        if (data.submissions < 5) {
          // User hasn't completed all 5 days
          setNextTask(`/completion/${data.currentWeek}/${applicationDayNumber}`);
        } else {
          // All days completed
          setNextTask(null);
        }
      } else {
        // Weekend logic
        // Show reflection button regardless of submissions
        setNextTask(`/completion/${data.currentWeek}/reflection`);
      }
    }

    fetchProgress();
  }, []);

  if (!progress) {
    return <div>Loading your progress...</div>;
  }

  return (
    <div>
      <h1>Welcome to Your Dashboard</h1>
      <p>Current Week: {progress.currentWeek}</p>
      <p>Days Completed This Week: {progress.submissions} / 5</p>

      {nextTask ? (
        <div>
          <button onClick={() => router.push(nextTask)}>
            {nextTask.includes('reflection') ? 'Go to Reflection' : 'Continue to Next Task'}
          </button>
        </div>
      ) : (
        <p>You&apos;ve completed all tasks for today!</p>
      )}
    </div>
  );
}
