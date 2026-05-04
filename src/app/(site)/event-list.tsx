"use client";

import dayjs from "@/libs/dayjs";
import { urlFor } from "@/sanity/image";
import Image from "next/image";
import Link from "next/link";
import { use } from "react";
import { FaCalendarCheck, FaEye, FaThumbsUp, FaUser } from "react-icons/fa6";
import { type Events } from "./actions";

export interface EventListProps {
  events: Events;
}

export default async function EventList(props: EventListProps) {
  const events = use(props.events);

  return (
    <div className="gap-4 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
      {events
        .filter(({ slug }) => slug)
        .map((event) => (
          <Link key={event._id} href={`/event/${event.slug!.current}`}>
            <div className="relative bg-gray-200 shadow-md text-shadow-lg border border-gray-300 rounded-lg aspect-video overflow-hidden text-white">
              {event.thumbnail && (
                <Image
                  width={640}
                  height={360}
                  loading="eager"
                  alt={event.title ?? "Gambar thumbnail"}
                  src={urlFor(event.thumbnail).size(640, 360).url()}
                />
              )}
              <div className="top-0 absolute flex bg-linear-to-b from-black/80 to-black/0 px-3 pt-1 pb-3 w-full">
                <h5 className="text-lg">{event.title}</h5>
              </div>
              <div className="bottom-0 absolute flex justify-between bg-linear-to-t from-black/80 to-black/0 px-3 pt-3 pb-0.5 w-full">
                <div className="flex items-baseline">
                  <FaCalendarCheck className="mr-2 w-3 h-3" />
                  {dayjs.tz(event.startDate).format("DD/MM/YYYY HH:mm")}
                </div>
                <div className="flex gap-3">
                  <div className="flex items-baseline">
                    {event.viewCount}
                    <FaEye className="ml-2 text-sm" />
                  </div>
                  <div className="flex items-baseline">
                    {event.likeCount}
                    <FaThumbsUp className="ml-2 text-sm" />
                  </div>
                  <div className="flex items-baseline">
                    {event.participantCount}
                    <FaUser className="ml-2 text-sm" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
    </div>
  );
}
