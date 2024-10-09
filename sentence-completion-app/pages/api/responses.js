// /pages/api/responses.js

import prisma from '../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';

const MAX_RESPONSES_PER_STEM_PER_DAY = 10;

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  console.log('Session in /api/responses:', session);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userId = session.user.id;

  if (req.method === 'POST') {
    const { responseText, sentenceStemId } = req.body;

    // Validate inputs
    if (!responseText || !sentenceStemId) {
      return res.status(400).json({ error: 'Response text and sentence stem ID are required.' });
    }

    try {
      // Ensure the sentence stem exists
      const stem = await prisma.sentenceStem.findUnique({
        where: { id: sentenceStemId },
      });

      if (!stem) {
        return res.status(400).json({ error: 'Invalid sentence stem ID.' });
      }

      // Define the start and end of today
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      // Count responses submitted today for this stem by the user
      const responseCount = await prisma.response.count({
        where: {
          userId: userId,
          sentenceStemId: sentenceStemId,
          createdAt: {
            gte: todayStart,
            lte: todayEnd,
          },
        },
      });

      if (responseCount >= MAX_RESPONSES_PER_STEM_PER_DAY) {
        return res.status(403).json({ error: `You have reached the maximum of ${MAX_RESPONSES_PER_STEM_PER_DAY} responses for this stem today.` });
      }

      // Create the response
      await prisma.response.create({
        data: {
          responseText,
          userId: userId,
          sentenceStemId: sentenceStemId,
        },
      });

      res.status(201).json({ message: 'Response saved successfully.' });
    } catch (error) {
      console.error('Error saving response:', error);
      res.status(500).json({ error: 'Error saving response.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Method ${req.method} not allowed.` });
  }
}
