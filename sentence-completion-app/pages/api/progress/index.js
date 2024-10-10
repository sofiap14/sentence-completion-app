// /pages/api/progress.js

import { getServerSession } from 'next-auth/next';
import prisma from '../../../lib/prisma.js';
import { authOptions } from '../auth/[...nextauth].js'; // Adjusted path

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  console.log('Session in /api/progress:', session);

  if (!session || !session.user || !session.user.id) {
    return res.status(401).json({ error: 'Unauthorized or missing user ID' });
  }

  const userId = session.user.id;

  try {
    // Find user's progress using their userId
    const progress = await prisma.progress.findUnique({
      where: {
        userId: userId,
      },
      select: {
        currentWeek: true,
        submissions: true,
      },
    });

    if (!progress) {
      return res.status(404).json({ error: 'Progress not found' });
    }

    res.status(200).json(progress);
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
