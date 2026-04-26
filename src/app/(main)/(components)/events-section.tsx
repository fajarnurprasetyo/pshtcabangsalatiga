import type { Event } from "#/sanity.types";
import sanity from "@/libs/sanity/client";
import { urlFor } from "@/libs/sanity/image";
import { Card } from "flowbite-react";
import type { Session } from "next-auth";
import Link from "next/link";

const EVENTS_QUERY = `*[
  _type == "event"
  && defined(slug.current)
]|order(date desc)[0...3]{_id, title, slug, date, image}`;

export interface EventsSectionProps {
  session: Session | null;
}

export async function EventsSection({ session }: EventsSectionProps) {
  const events = await sanity.fetch<Event[]>(EVENTS_QUERY);

  console.log(events);

  return (
    <div className="flex gap-4">
      {events.map((event) => (
        <Link
          key={event._id}
          href={`/event/${event.slug?.current}`}
          className="w-1/3"
        >
          <Card imgSrc={event.image && urlFor(event.image).url()}>
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {event.title}
            </h5>
          </Card>
        </Link>
      ))}
    </div>
  );
}

export function EventsSectionPlaceholder() {
  return "LOADING EVENTS...";
}
