// /pages/api/stems/index.js

import prisma from '../../../lib/prisma.js';
import { getServerSession } from 'next-auth/next'; // Use 'next-auth/next' in /pages/api
import { authOptions } from '../auth/[...nextauth].js';
import { fetchWeekNumber } from '../../../lib/utils.js'; // Adjust the path as needed

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = session.user.id;

    try {
      // Use the utility function to get the week number
      const weekNumber = await fetchWeekNumber(userId);

      // Define the start and end of today
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      // Fetch sentence stems for the user's current week along with today's responses
      const stems = await prisma.sentenceStem.findMany({
        where: {
          weekNumber,
        },
        orderBy: {
          order: 'asc',
        },
        include: {
          responses: {
            where: {
              userId,
              createdAt: {
                gte: todayStart,
                lte: todayEnd,
              },
            },
          },
        },
      });

      // Format stems to include the count of today's responses
      const formattedStems = stems.map((stem) => ({
        id: stem.id,
        text: stem.text,
        order: stem.order,
        responsesToday: stem.responses.length,
      }));

      res.status(200).json({ stems: formattedStems, weekNumber });
    } catch (error) {
      console.error('Error fetching stems:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  } else {
    // Reject all other methods
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Method ${req.method} not allowed.` });
  }
}
