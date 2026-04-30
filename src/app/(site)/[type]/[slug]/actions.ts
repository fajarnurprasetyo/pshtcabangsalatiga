"use server";

import { authOptions } from "@/libs/next-auth";
import prisma from "@/libs/prisma";
import { fetchArticle } from "@/libs/sanity/queries";
import { fetchEvent } from "@/libs/sanity/queries/event";
import { getServerSession } from "next-auth";

export async function getArticle(slug: string) {
  const data = await fetchArticle(slug);
  if (!data) return null;

  const likes = await prisma.like.findMany({
    select: { userId: true, targetId: true },
    where: { targetId: data._id },
  });

  return { ...data, likes };
}

export async function getEvent(slug: string) {
  const data = await fetchEvent(slug);
  if (!data) return null;

  const targetId = data._id;
  const [likes, participants] = await Promise.all([
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

export async function updateLikeEvent(targetId: string, like: boolean) {
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
      return like;
    } catch (err) {
      console.error(err);
    }
  }

  return !like;
}

export async function joinEvent(targetId: string) {
  const session = await getServerSession(authOptions);
  if (!session) return false;

  try {
    const userId = session.user.id;
    await prisma.participant.create({
      data: { userId, targetId },
    });
    return true;
  } catch (err) {
    console.error(err);
  }

  return false;
}
