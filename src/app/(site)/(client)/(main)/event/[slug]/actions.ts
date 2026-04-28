"use server";

import type { Event } from "@/generated/types/sanity-types";
import { authOptions } from "@/libs/next-auth";
import prisma from "@/libs/prisma";
import { fetchEvent } from "@/libs/sanity/queries/event";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function fetchData(slug: string) {
  const data = await fetchEvent(slug);
  if (!data) return null;

  const targetId = data._id;

  const [likes, participants] = await prisma.$transaction([
    prisma.like.findMany({
      select: { userId: true, targetId: true },
      where: { targetId },
    }),
    prisma.participant.findMany({
      select: { userId: true, targetId: true },
      where: { targetId },
    }),
  ]);

  return { ...data, likes, participants };
}

export async function updateLikeEvent(targetId: Event["_id"], like: boolean) {
  const session = await getServerSession(authOptions);

  if (session) {
    const userId = session.user.id;
    try {
      if (like) {
        await prisma.like.create({
          data: { userId, targetId },
        });
      } else {
        await prisma.like.delete({
          where: { userId_targetId: { userId, targetId } },
        });
      }
      revalidatePath("/");
      return like;
    } catch (error) {
      console.error(error);
    }
  }

  return !like;
}

export async function joinEvent(targetId: Event["_id"]) {
  const session = await getServerSession(authOptions);
  if (!session) return false;

  try {
    const userId = session.user.id;
    await prisma.participant.create({
      data: { userId, targetId },
    });
    revalidatePath("/");
    return true;
  } catch (error) {
    console.error(error);
  }

  return false;
}
