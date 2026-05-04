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

  await prisma.$transaction(async (tx) => {
    const users = await tx.user.findMany({
      where: { person: null },
    });

    if (users.length === 0) return;
    console.log("Patching existing User...");

    for (const user of users) {
      await tx.person.create({
        data: {
          name: user.name,
          ...(user.branchId && {
            branch: user.branchId
              ? { connect: { id: user.branchId } }
              : undefined,
          }),
          user: { connect: { id: user.id } },
        },
      });
    }
  });
}
