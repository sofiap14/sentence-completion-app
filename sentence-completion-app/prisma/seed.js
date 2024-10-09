// prisma/seed.js

import prisma from '../lib/prisma.js';

async function main() {
  const stems = [
    // Week 1
    { text: 'If I were more accepting of myself...', weekNumber: 1, order: 1 },
    { text: 'If I took more responsibility for my life...', weekNumber: 1, order: 2 },
    { text: 'If I had the courage to express my feelings...', weekNumber: 1, order: 3 },
    { text: 'If I were to take more risks...', weekNumber: 1, order: 4 },
    // Week 2
    { text: 'If I were to be more honest with myself...', weekNumber: 2, order: 1 },
    { text: 'If I prioritized my needs...', weekNumber: 2, order: 2 },
    { text: 'If I faced my fears...', weekNumber: 2, order: 3 },
    { text: 'If I let go of the past...', weekNumber: 2, order: 4 },
    // Add stems for additional weeks as needed
  ];

  for (const stem of stems) {
    await prisma.sentenceStem.create({
      data: stem,
    });
  }

  console.log('Sentence stems seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
