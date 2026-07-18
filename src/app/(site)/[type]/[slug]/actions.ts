"use server";

import { auth } from "@/libs/auth";
import prisma from "@/libs/prisma";
import { fetchArticle } from "@/sanity/queries";
import { fetchEvent } from "@/sanity/queries/event";
import { cacheTag, revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export async function getArticle<F extends boolean = false>(
  slug: string,
  full: F = false as F,
) {
  "use cache";

  const data = await fetchArticle(slug, full);
  if (!data) return null;

  const postId = data._id;
  cacheTag(`article:${postId}`, `article:${postId}:${JSON.stringify(full)}`);

  const [views, likes] = await Promise.all([
    prisma.postView
      .findUniqueOrThrow({
        select: { views: true },
        where: { postId },
      })
      .then(({ views }) => views),
    prisma.postLike.findMany({
      select: { userId: true, postId: true },
      where: { postId },
    }),
  ]);

  return { ...data, views, likes };
}

export type Article<F extends boolean> = ReturnType<typeof getArticle<F>>;

export async function getEvent<F extends boolean = false>(
  slug: string,
  full: F = false as F,
) {
  "use cache";

  const data = await fetchEvent(slug, full);
  if (!data) return null;

  const postId = data._id;
  cacheTag(`event:${postId}`, `event:${postId}:${JSON.stringify(full)}`);

  const [views, likes, participants] = await Promise.all([
    prisma.$transaction(async (tx) => {
      let post = await tx.postView.findUnique({
        select: { views: true },
        where: { postId },
      });

      if (!post) {
        post = await tx.postView.create({ data: { postId } });
      }

      return post.views;
    }),
    prisma.postLike.findMany({
      select: { userId: true, postId: true },
      where: { postId },
    }),
    prisma.participant.findMany({
      select: { userId: true, postId: true },
      where: { postId },
    }),
  ]);

  return { ...data, views, likes, participants };
}

export type Event<F extends boolean> = ReturnType<typeof getEvent<F>>;

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
