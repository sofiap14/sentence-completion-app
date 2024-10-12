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
      },
    });

    if (!progress) {
      return res.status(404).json({ error: 'Progress not found' });
    }

    const { currentWeek } = progress;

    // Get the start and end of the current week (Monday to Sunday)
    const today = new Date();
    const firstDayOfWeek = new Date(today);
    const dayOfWeek = today.getDay(); // 0 (Sunday) - 6 (Saturday)
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    firstDayOfWeek.setDate(today.getDate() + diffToMonday);
    firstDayOfWeek.setHours(0, 0, 0, 0);

    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
    lastDayOfWeek.setHours(23, 59, 59, 999);

    // Fetch responses for the user for the current week
    const responses = await prisma.response.findMany({
      where: {
        userId: userId,
        createdAt: {
          gte: firstDayOfWeek,
          lte: lastDayOfWeek,
        },
      },
      select: {
        createdAt: true,
      },
    });

    // Get the unique dates on which the user submitted responses
    const daysCompletedSet = new Set(
      responses.map((response) => response.createdAt.toISOString().split('T')[0])
    );

    const submissions = daysCompletedSet.size;

    res.status(200).json({ currentWeek, submissions });
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
