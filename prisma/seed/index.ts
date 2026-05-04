import prisma from "@/libs/prisma";
import seedBranch from "./branch";
import seedUser from "./user";

async function seed() {
  await seedBranch();
  await seedUser();
}

seed()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
