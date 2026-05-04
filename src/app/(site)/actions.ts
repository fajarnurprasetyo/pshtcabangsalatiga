"use server";

import type { Event } from "@/generated/types/sanity";
import prisma from "@/libs/prisma";
import { fetchEvents } from "@/sanity/queries/event";
import { cacheTag } from "next/cache";

export async function getEvents(type: NonNullable<Event["type"]>) {
  "use cache";

  const events = await fetchEvents({ type, take: 3 });
  cacheTag("event", ...events.map((event) => `event:${event._id}`));

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

export type Events = ReturnType<typeof getEvents>;
