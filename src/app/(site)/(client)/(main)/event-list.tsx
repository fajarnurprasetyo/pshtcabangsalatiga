"use client";

import { urlFor } from "@/libs/sanity/image";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { use } from "react";
import { FaClock, FaThumbsUp, FaUser } from "react-icons/fa6";
import type { Data } from "./actions";

export interface EventListProps {
  data: Promise<Data>;
}

export default function EventList(props: EventListProps) {
  const events = use(props.data);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      {events.map((event) => (
        <Link key={event._id} href={`/event/${event.slug!.current}`}>
          <div className="relative rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800 text-shadow-lg aspect-video overflow-hidden">
            <Image
              alt={event.title!}
              src={urlFor(event.thumbnail!).size(640, 360).url()}
              width={640}
              height={360}
            />
            <div className="absolute w-full flex top-0 bg-gradient-to-b from-black/80 to-black/0 px-3 pb-3 pt-1">
              <h5 className="text-lg">{event.title}</h5>
            </div>
            <div className="absolute w-full flex bottom-0 bg-gradient-to-t from-black/80 to-black/0 px-3 pb-0.5 pt-3 justify-between">
              <div className="flex items-baseline">
                <FaClock className="mr-1 w-3 h-3" />
                {dayjs(event.startDate).format("DD/MM/YYYY HH:mm")}
              </div>
              <div className="flex gap-3">
                <div className="flex items-baseline">
                  {event.likeCount}
                  <FaThumbsUp className="text-sm ml-2" />
                </div>
                <div className="flex items-baseline">
                  {event.participantCount}
                  <FaUser className="text-sm ml-2" />
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
