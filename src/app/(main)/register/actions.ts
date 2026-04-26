"use server";

import prisma from "@/libs/prisma";
import { UsernameSchema, UserRegisterSchema } from "@/libs/shared/schemas/user";
import bcrypt from "bcrypt";
import type { ZodError } from "zod";

export async function checkUsername(username: string) {
  const userCount = await prisma.user.count({
    where: { username: UsernameSchema.parse(username) },
  });
  return userCount === 0;
}

export async function findBranch(query: string) {
  const trimmedQuery = query.trim();
  if (trimmedQuery.length === 0) return [];

  const num = parseInt(trimmedQuery);
  return await prisma.branch.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
    where: {
      AND: [
        { deletedAt: null },
        {
          OR: [
            ...(isNaN(num)
              ? []
              : [
                  { id: num },
                  {
                    id: {
                      gte: num * 10,
                      lt: (num + 1) * 10,
                    },
                  },
                ]),
            {
              name: {
                contains: trimmedQuery,
                mode: "insensitive",
              },
            },
          ],
        },
      ],
    },
    take: 10,
  });
}

export async function register(payload: Record<string, unknown>): Promise<
  | {
      error: null;
      data: { username: string; password: string };
    }
  | { error: ZodError | unknown; data: null }
> {
  const parsed = UserRegisterSchema.safeParse(payload);

  if (!parsed.success) return { error: parsed.error, data: null };

  try {
    const user = await prisma.user.create({
      data: {
        name: parsed.data.name,
        username: parsed.data.username,
        branchId: parsed.data["branch-id"],
        subBranch: parsed.data["sub-branch"],
        roles: [parsed.data.role],
        encryptedPassword: bcrypt.hashSync(parsed.data.password, 12),
      },
    });

    return {
      error: null,
      data: { username: user.username, password: parsed.data.password },
    };
  } catch (error) {
    console.error(error);
    return { error, data: null };
  }
}
