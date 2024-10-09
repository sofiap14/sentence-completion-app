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
      const today = new Date().getDay();
      if (data.submissions < 5 && today <= 5) {
        // If they haven't completed all 5 days and it's a weekday, show the next task
        setNextTask(`/completion/${data.currentWeek}/${today}`);
      } else if (today > 5 && data.submissions >= 3) {
        // If it’s the weekend and they completed enough days, go to reflection
        setNextTask(`/completion/${data.currentWeek}/reflection`);
      } else {
        // If no tasks are available, just display the dashboard
        setNextTask(null);
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
          <button onClick={() => router.push(nextTask)}>Continue to Next Task</button>
        </div>
      ) : (
        <p>You&apos;ve completed all tasks for today!</p>
      )}
    </div>
  );
}

