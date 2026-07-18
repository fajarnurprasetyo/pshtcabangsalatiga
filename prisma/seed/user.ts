import { UserRole } from "@/generated/prisma/client";
import Env from "@/libs/env";
import prisma from "@/libs/prisma";
import bcrypt from "bcrypt";

export default async function seedUser() {
  const { ADMIN_USERNAME, ADMIN_PASSWORD } = Env;
  if (ADMIN_USERNAME && ADMIN_PASSWORD) {
    await prisma.$transaction(async (tx) => {
      const exists = await tx.user.findUnique({
        where: { username: ADMIN_USERNAME },
      });

      if (exists) return;
      console.log("Seeding User...");

      await tx.user.create({
        data: {
          username: ADMIN_USERNAME,
          encryptedPassword: bcrypt.hashSync(ADMIN_PASSWORD, 12),
          roles: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
          person: { create: { name: "Admin" } },
        },
      });
    });
  }

  const users = await prisma.user.findMany({
    where: { person: null },
  });

  if (users.length === 0) return;
  console.log("Patching existing User...");

  await prisma.person.createMany({
    data: users.map((user) => ({
      name: user.name,
      branchId: user.branchId || undefined,
      userId: user.id,
    })),
  });
}
