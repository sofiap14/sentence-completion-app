import prisma from '../../prisma/lib/prisma';
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  // Ensure the user is authenticated
  const session = await getSession({ req });
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

      // Create the response
      await prisma.response.create({
        data: {
          responseText,
          userId,
          sentenceStemId,
        },
      });

      // Check if the user has completed all stems for the week
      const totalStemsForWeek = await prisma.sentenceStem.count({
        where: { weekNumber: stem.weekNumber },
      });

      const userResponsesForWeek = await prisma.response.count({
        where: {
          userId: userId,
          sentenceStem: {
            weekNumber: stem.weekNumber,
          },
        },
      });

      if (userResponsesForWeek >= totalStemsForWeek * 5) {
        // User has completed all stems for the week (assuming 5 days)
        // Increment user's currentWeek
        await prisma.user.update({
          where: { id: userId },
          data: {
            currentWeek: {
              increment: 1,
            },
          },
        });
      }

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
