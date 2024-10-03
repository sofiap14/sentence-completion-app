// /pages/api/responses.js

import prisma from '../../prisma/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';

const MAX_RESPONSES_PER_STEM = 10;

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

      // Check the current number of responses for this stem by the user
      const currentResponseCount = await prisma.response.count({
        where: {
          userId: userId,
          sentenceStemId: sentenceStemId,
        },
      });

      if (currentResponseCount >= MAX_RESPONSES_PER_STEM) {
        return res.status(400).json({ error: `You have reached the maximum of ${MAX_RESPONSES_PER_STEM} responses for this stem.` });
      }

      // Create the response
      await prisma.response.create({
        data: {
          responseText,
          userId,
          sentenceStemId,
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
