"use server";

import { auth } from "@/libs/auth";
import prisma from "@/libs/prisma";
import { fetchArticle } from "@/sanity/queries";
import { fetchEvent } from "@/sanity/queries/event";
import { cacheTag, revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export async function getArticle(slug: string) {
  "use cache";

  const data = await fetchArticle(slug);
  if (!data) return null;

  const postId = data._id;
  cacheTag(`article:${postId}`);

  const likes = await prisma.postLike.findMany({
    select: { userId: true, postId: true },
    where: { postId },
  });

  return { ...data, likes };
}

export type Article = ReturnType<typeof getArticle>;

export async function getEvent(slug: string) {
  "use cache";

  const data = await fetchEvent(slug);
  if (!data) return null;

  const postId = data._id;
  cacheTag(`event:${postId}`);

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
  const session = await auth();
  if (!session) return false;

  try {
    const userId = session.user.id;
    await prisma.participant.create({
      data: { userId, postId },
    });

    revalidateTag("event", "max");
    revalidateTag(`event:${postId}`, "max");
    return true;
  } catch (err) {
    console.error(err);
  }

  return false;
}

export async function updateLikePost(
  type: string,
  postId: string,
  like: boolean,
) {
  const session = await auth();

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

      revalidateTag(type, "max");
      revalidateTag(`${type}:${postId}`, "max");
      return like;
    } catch (err) {
      console.error(err);
    }
  }

  return !like;
}

export async function updatePostView(type: string, postId: string) {
  const cookieStore = await cookies();
  const tag = `${type}:${postId}`;
  const key = `${tag}:view`;

  if (!cookieStore.has(key)) {
    await prisma.postView.upsert({
      where: { postId },
      create: { postId, views: 1 },
      update: { views: { increment: 1 } },
    });

    cookieStore.set(key, "true", {
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    revalidateTag(type, "max");
    revalidateTag(tag, "max");
  }
}
