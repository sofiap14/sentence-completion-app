import prisma from '../../prisma/lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userId, content } = req.body;

    if (!userId || !content) {
      return res.status(400).json({ error: 'User ID and content are required' });
    }

    try {
      const response = await prisma.response.create({
        data: {
          userId,
          content,
        },
      });
      return res.status(201).json(response);
    } catch (error) {
      console.error('Failed to save response: ', error);
      return res.status(500).json({ error: 'Failed to save response' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
