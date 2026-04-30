import { UserRole } from "@/generated/prisma/enums";
import bcrypt from "bcrypt";
import prisma from "../../src/libs/prisma";
import branch from "./branch.json";

async function seed() {
  await prisma.$transaction(async (tx) => {
    const exists = await tx.branch.findFirst({ select: { id: true } });
    if (!exists) await tx.branch.createMany({ data: branch });
  });

  const { ADMIN_NAME, ADMIN_USERNAME, ADMIN_PASSWORD } = process.env;
  if (ADMIN_USERNAME && ADMIN_PASSWORD) {
    await prisma.user.upsert({
      where: { username: ADMIN_USERNAME },
      update: {},
      create: {
        name: ADMIN_NAME ?? "Admin",
        username: ADMIN_USERNAME,
        encryptedPassword: bcrypt.hashSync(ADMIN_PASSWORD, 12),
        roles: [UserRole.ADMIN],
      },
    });
  }
}

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
