import type {
  Event,
  EventQueryResult,
  EventsQueryResult,
} from "@/generated/types/sanity-types";
import { groq } from "next-sanity";
import z from "zod";
import sanity from "./client";

export const EventsQuery = groq`
*[
  _type == "event"
  && defined(slug.current)
  && (!defined($type) || type == $type)
]
| order(date desc)
[$start...$end]
{
  _id,
  type,
  title,
  slug,
  date,
  startDate,
  finishDate,
  fullDay,
  location,
  thumbnail
}
`;

export interface FetchEventsOptions {
  type?: Event["type"];
  skip?: number;
  take?: number;
}

const FetchEventsParamsSchema = z
  .object({
    type: z
      .enum(["seminar", "competition"] satisfies Event["type"][])
      .optional(),
    skip: z.number().int().positive().default(0),
    take: z.number().int().positive().default(100),
  })
  .transform(({ type, skip, take }) => ({
    type,
    start: skip,
    end: skip + Math.min(take, 100),
  }));

export type FetchEventsResult = EventsQueryResult;

export async function fetchEvents<
  R extends FetchEventsResult = FetchEventsResult,
>(options?: FetchEventsOptions) {
  const params = FetchEventsParamsSchema.parse(options);
  return await sanity.fetch<R>(EventsQuery, params);
}

export const EventQuery = groq`
*[
  _type == "event"
  && slug.current == $slug
][0]
{
  _id,
  type,
  title,
  slug,
  date,
  startDate,
  finishDate,
  fullDay,
  location,
  thumbnail,
  content
}
`;

export async function fetchEvent(slug: string) {
  return await sanity.fetch<EventQueryResult>(EventQuery, { slug });
}
