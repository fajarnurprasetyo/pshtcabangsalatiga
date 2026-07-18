import type {
  Event,
  EventQueryFullResult,
  EventQueryResult,
  EventsQueryResult
} from "@/sanity/types";
import { groq } from "next-sanity";
import z from "zod";
import client from "./client";

export const EventsQuery = groq`
*[
  _type == "event"
  && defined(slug.current)
  && (!defined($type) || type == $type)
]
|order(date desc)[$start...$end]
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
  image
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
  return await client.fetch<R>(EventsQuery, params);
}

export const EventQuery = groq`
*[_type == "event" && slug.current == $slug][0]
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
  image,
  description
}
`;

export const EventQueryFull = groq`
*[_type == "event" && slug.current == $slug][0]
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
  image,
  description,
  content,
  "hasCertificate": count(*[_type == "certificate" && event._ref == ^._id]) > 0
}
`;

export async function fetchEvent<
  F extends boolean = false,
  R = F extends true ? EventQueryFullResult : EventQueryResult,
>(slug: string, full?: F) {
  return await client.fetch<R>(full ? EventQueryFull : EventQuery, { slug });
}
