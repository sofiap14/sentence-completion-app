import { getISOWeek } from 'date-fns';

export async function fetchWeekNumber(userId) {
  // Attempt to find the Progress record for the user
  let progress = await prisma.progress.findUnique({
    where: { userId },
    select: { currentWeek: true },
  });

  // If Progress doesn't exist, create it with default values
  if (!progress) {
    progress = await prisma.progress.create({
      data: {
        userId,
        currentWeek: 1, // Default starting week
        submissions: 0,
      },
      select: { currentWeek: true },
    });
  }

  // Return the currentWeek
  return progress.currentWeek;
}
