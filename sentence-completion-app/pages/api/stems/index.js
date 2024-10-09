import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { week, day } = req.query;

  try {
    const stems = await prisma.sentenceStem.findMany({
      where: {
        weekNumber: parseInt(week),
      },
      orderBy: {
        order: 'asc',
      },
    });

    if (!stems.length) {
      return res.status(404).json({ error: 'No stems found for this week' });
    }

    res.status(200).json(stems);
  } catch (error) {
    console.error('Error fetching stems:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
