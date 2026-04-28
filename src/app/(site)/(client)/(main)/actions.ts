"use server";

import type { Event } from "@/generated/types/sanity-types";
import prisma from "@/libs/prisma";
import { fetchEvents } from "@/libs/sanity/queries/event";

export async function fetchData(type: Required<Event["type"]>) {
  const events = await fetchEvents({ type: type, take: 3 });
  return Promise.all(
    events.map(async (data) => {
      const targetId = data._id;

      const [likeCount, participantCount] = await prisma.$transaction([
        prisma.like.count({ where: { targetId } }),
        prisma.participant.count({ where: { targetId } }),
      ]);

      return { ...data, likeCount, participantCount };
    }),
  );
}

export type Data = NonNullable<Awaited<ReturnType<typeof fetchData>>>;
