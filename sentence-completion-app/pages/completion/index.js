import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function CompletionIndexPage() {
  const router = useRouter();

  useEffect(() => {
    async function redirectToCurrentDay() {
      const currentWeek = await fetch('/api/progress').then(res => res.json());
      const currentDay = new Date().getDay();
      
      router.push(`/completion/${currentWeek}/${currentDay}`);
    }

    redirectToCurrentDay();
  }, []);

  return (
    <div>
      <p>Redirecting to your current completion page...</p>
    </div>
  );
}
