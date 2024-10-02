// /pages/api/stems.js

import prisma from '../../prisma/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';

export default async function handler(req, res) {
  // Retrieve the session
  const session = await getServerSession(req, res, authOptions);
  console.log('Session in /api/stems:', session);

  // If no session, return unauthorized error
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Extract user ID from session
  const userId = session.user.id;

  // Fetch the user's currentWeek
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { currentWeek: true },
  });

  // If user not found, return error
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

  // Return the stems and week number
  res.status(200).json({ stems, weekNumber });
}
