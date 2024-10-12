// /pages/api/getAllResponses.js

import prisma from '../../prisma/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  console.log('Session in /api/getAllResponses:', session);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userId = session.user.id;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  try {
    // Fetch user's current week
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { currentWeek: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const weekNumber = user.currentWeek;

    // Fetch stems for the current week along with all responses
    const stems = await prisma.sentenceStem.findMany({
      where: { weekNumber: weekNumber },
      orderBy: { order: 'asc' },
      include: {
        responses: {
          where: { userId: userId },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    // Format stems with all responses
    const formattedStems = stems.map((stem) => ({
      id: stem.id,
      text: stem.text,
      order: stem.order,
      responsesWithDates: stem.responses.map((response) => ({
        id: response.id,
        responseText: response.responseText,
        createdAt: response.createdAt,
      })),
    }));

    res.status(200).json({ stemsWithResponses: formattedStems, weekNumber });
  } catch (error) {
    console.error('Error fetching all responses:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
}
