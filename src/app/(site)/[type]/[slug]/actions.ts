"use server";

import { authOptions } from "@/next-auth";
import prisma from "@/prisma";
import { fetchArticle } from "@/sanity/queries";
import { fetchEvent } from "@/sanity/queries/event";
import { getServerSession } from "next-auth";

export async function getArticle(slug: string) {
  const data = await fetchArticle(slug);
  if (!data) return null;

  const likes = await prisma.postLike.findMany({
    select: { userId: true, postId: true },
    where: { postId: data._id },
  });

  return { ...data, likes };
}

export type Article = ReturnType<typeof getArticle>;

export async function getEvent(slug: string) {
  const data = await fetchEvent(slug);
  if (!data) return null;

  const postId = data._id;
  const [likes, participants] = await Promise.all([
    prisma.postLike.findMany({
      select: { userId: true, postId: true },
      where: { postId },
    }),
    prisma.participant.findMany({
      select: { userId: true, postId: true },
      where: { postId },
    }),
  ]);

  return { ...data, likes, participants };
}

export type Event = ReturnType<typeof getEvent>;

export async function joinEvent(postId: string) {
  const session = await getServerSession(authOptions);
  if (!session) return false;

  try {
    const userId = session.user.id;
    await prisma.participant.create({
      data: { userId, postId },
    });
    return true;
  } catch (err) {
    console.error(err);
  }

  return false;
}

export async function updateLikeEvent(postId: string, like: boolean) {
  const session = await getServerSession(authOptions);

  if (session) {
    const userId = session.user.id;
    try {
      if (like) {
        await prisma.postLike.create({
          data: { userId, postId },
        });
      } else {
        await prisma.postLike.delete({
          where: { userId_postId: { userId, postId } },
        });
      }
      return like;
    } catch (err) {
      console.error(err);
    }
  }

  return !like;
}

export async function updatePostView(postId: string) {
  await prisma.postView.upsert({
    where: { postId },
    create: { postId, views: 1 },
    update: { views: { increment: 1 } },
  });
}
