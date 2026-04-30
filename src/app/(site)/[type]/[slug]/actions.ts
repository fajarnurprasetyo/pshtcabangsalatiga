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
    select: { userId: true, postId: true },
    where: { postId: data._id },
  });

  return { ...data, likes };
}

export async function getEvent(slug: string) {
  const data = await fetchEvent(slug);
  if (!data) return null;

  const postId = data._id;
  const [likes, participants] = await Promise.all([
    prisma.like.findMany({
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

export async function updateLikeEvent(postId: string, like: boolean) {
  const session = await getServerSession(authOptions);

  if (session) {
    const userId = session.user.id;
    try {
      if (like) {
        await prisma.like.create({
          data: { userId, postId },
        });
      } else {
        await prisma.like.delete({
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
