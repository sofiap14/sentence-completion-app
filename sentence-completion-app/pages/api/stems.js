// /pages/api/stems.js

import prisma from '../../lib/prisma.js';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import { getCurrentWeekNumber } from '../../lib/utils.js';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  console.log('Session in /api/stems:', session);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userId = session.user.id;
  console.log(`Fetching stems for user ID: ${userId}`);

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { currentWeek: true },
    });
    console.log(`User's current week: ${user.currentWeek}`);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const weekNumber = user.currentWeek;

    // Define the start and end of today
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Fetch sentence stems for the user's current week along with today's responses
    const stems = await prisma.sentenceStem.findMany({
      where: {
        weekNumber: weekNumber,
      },
      orderBy: {
        order: 'asc',
      },
      include: {
        responses: {
          where: {
            userId: userId,
            createdAt: {
              gte: todayStart,
              lte: todayEnd,
            },
          },
        },
      },
    });
    console.log(`Number of stems fetched: ${stems.length}`);
    console.log('Stems:', stems);

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
}
