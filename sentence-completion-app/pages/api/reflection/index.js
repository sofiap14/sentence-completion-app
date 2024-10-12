// /pages/api/reflection.js

import prisma from '../../../lib/prisma.js';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth].js';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userId = session.user.id;

  if (req.method === 'GET') {
    try {
      const { week } = req.query;
      const weekNumber = parseInt(week);

      if (isNaN(weekNumber)) {
        return res.status(400).json({ error: 'Invalid week number.' });
      }

      // Fetch responses for the user for the specified week
      const responses = await prisma.response.findMany({
        where: {
          userId: userId,
          sentenceStem: {
            weekNumber: weekNumber,
          },
        },
        include: {
          sentenceStem: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      });

      // Group responses by day
      const responsesByDay = {};

      responses.forEach((response) => {
        const date = response.createdAt.toISOString().split('T')[0]; // YYYY-MM-DD
        if (!responsesByDay[date]) {
          responsesByDay[date] = [];
        }
        responsesByDay[date].push(response);
      });

      res.status(200).json({ responsesByDay });
    } catch (error) {
      console.error('Error fetching reflection data:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Method ${req.method} not allowed.` });
  }
}
