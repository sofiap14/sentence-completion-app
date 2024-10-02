import prisma from '../../prisma/lib/prisma';
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  // Ensure the user is authenticated
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const userId = session.user.id;

      // Fetch the user's currentWeek
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { currentWeek: true },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      const weekNumber = user.currentWeek;

      // Fetch sentence stems for the user's current week
      const stems = await prisma.sentenceStem.findMany({
        where: {
          weekNumber: weekNumber,
        },
        orderBy: {
          order: 'asc',
        },
      });

      res.status(200).json({ stems, weekNumber });
    } catch (error) {
      console.error('Error fetching stems:', error);
      res.status(500).json({ error: 'Error fetching stems.' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Method ${req.method} not allowed.` });
  }
}
