// scripts/updateWeek.js
import prisma from '../lib/prisma.js';

async function main() {
  const updatedUser = await prisma.user.update({
    where: { id: 1 },
    data: { currentWeek: 1 },
  });
  console.log('Updated User:', updatedUser);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
