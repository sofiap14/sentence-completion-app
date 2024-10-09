import { getSession } from 'next-auth/react';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const session = await getSession({ req });

  // Log session for debugging purposes
  console.log('Session:', session);

  if (!session || !session.user?.id) {
    return res.status(401).json({ error: 'Unauthorized or missing user ID' });
  }

  const userId = session.user.id;

  try {
    // Find user's progress using their userId
    const progress = await prisma.progress.findFirst({
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
