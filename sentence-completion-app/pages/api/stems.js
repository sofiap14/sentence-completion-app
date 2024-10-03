// /pages/api/stems.js

import prisma from '../../prisma/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';

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

    // Fetch sentence stems for the user's current week along with existing responses
    const stems = await prisma.sentenceStem.findMany({
      where: {
        weekNumber: weekNumber,
      },
      orderBy: {
        order: 'asc',
      },
      include: {
        responses: {
          where: { userId: userId },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
    console.log(`Number of stems fetched: ${stems.length}`);
    console.log('Stems:', stems);

    res.status(200).json({ stems, weekNumber });
  } catch (error) {
    console.error('Error fetching stems:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
}
