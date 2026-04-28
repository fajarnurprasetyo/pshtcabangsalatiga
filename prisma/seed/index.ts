import "dotenv/config";
import prisma from "../../src/libs/prisma";
import branch from "./branch.json";

async function seed() {
  await prisma.branch.createMany({ data: branch });
}

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
