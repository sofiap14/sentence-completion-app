// /pages/api/getAllResponses.js

import prisma from '../../lib/prisma.js';// /pages/api/getAllResponses.js
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import { getCurrentWeekNumber } from '../../lib/utils.js';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userId = session.user.id;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  try {
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
      where: { weekNumber },
      orderBy: { order: 'asc' },
      include: {
        responses: {
          where: { userId },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    // Group responses by day
    const responsesByDay = {};

    stems.forEach((stem) => {
      stem.responses.forEach((response) => {
        const date = new Date(response.createdAt);
        const day = date.toLocaleDateString('en-US', { weekday: 'long' }); // e.g., 'Monday'
        if (!responsesByDay[stem.id]) {
          responsesByDay[stem.id] = {};
        }
        if (!responsesByDay[stem.id][day]) {
          responsesByDay[stem.id][day] = [];
        }
        responsesByDay[stem.id][day].push({
          id: response.id,
          responseText: response.responseText,
          createdAt: response.createdAt,
        });
      });
    });

    // Prepare final response structure
    const formattedStems = stems.map((stem) => {
      // Define all weekdays
      const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
      const stemResponses = {};

      daysOfWeek.forEach((day) => {
        stemResponses[day] = responsesByDay[stem.id]?.[day] || [];
      });

      return {
        id: stem.id,
        text: stem.text,
        order: stem.order,
        responsesByDay: stemResponses,
      };
    });

    res.status(200).json({ stemsWithResponses: formattedStems, weekNumber });
  } catch (error) {
    console.error('Error fetching all responses:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
}
