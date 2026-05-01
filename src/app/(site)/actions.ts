"use server";

import type { Event } from "@/generated/types/sanity";
import prisma from "@/prisma";
import { fetchEvents } from "@/sanity/queries/event";

export async function fetchData(type: Required<Event["type"]>) {
  const events = await fetchEvents({ type: type, take: 3 });
  return Promise.all(
    events.map(async (data) => {
      const postId = data._id;
      const [viewCount, likeCount, participantCount] = await Promise.all([
        prisma.postView
          .findUnique({ where: { postId } })
          .then((value) => value?.views ?? 0),
        prisma.postLike.count({ where: { postId } }),
        prisma.participant.count({
          where: { postId },
        }),
      ]);
      return { ...data, viewCount, likeCount, participantCount };
    }),
  );
}

export type Data = NonNullable<Awaited<ReturnType<typeof fetchData>>>;
