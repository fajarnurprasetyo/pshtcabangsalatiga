"use client";

import useLoginUrl from "@/libs/hooks/useLoginUrl";
import { urlFor } from "@/libs/sanity/image";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { Button } from "flowbite-react";
import type { Session } from "next-auth";
import Image from "next/image";
import { notFound, redirect, usePathname } from "next/navigation";
import React from "react";
import {
  FaCheck,
  FaShare,
  FaSpinner,
  FaThumbsUp,
  FaUserPlus,
} from "react-icons/fa6";
import { useBoolean } from "react-use";
import { joinEvent, updateLikeEvent, type fetchData } from "./actions";

dayjs.locale("id");

export interface SeminarViewProps {
  session: Promise<Session | null>;
  data: ReturnType<typeof fetchData>;
}

export default function SeminarView(props: SeminarViewProps) {
  const event = React.use(props.data);
  if (!event) notFound();

  const session = React.use(props.session);
  const pathname = usePathname();
  const loginUrl = useLoginUrl();

  const [liked, setLiked] = useBoolean(
    !!session && event.likes.some(({ userId }) => userId === session.user.id),
  );
  const [likePending, setLikePending] = useBoolean(false);

  const handleLike = async () => {
    if (!session) redirect(loginUrl, "push");
    if (likePending) return;

    setLikePending(true);

    const next = !liked;
    setLiked(next);
    const update = await updateLikeEvent(event._id, next);
    setLiked(update);

    setLikePending(false);
  };

  const [sharing, setSharing] = useBoolean(false);

  const handleShare = async () => {
    setSharing(true);

    await navigator.share({
      title: event.title!,
      url: pathname,
    });

    setSharing(false);
  };

  const [joined, setJoined] = useBoolean(
    !!session &&
      event.participants.some(({ userId }) => userId === session.user.id),
  );
  const [joinPending, setJoinPending] = useBoolean(false);

  const handleJoin = async () => {
    if (!session) redirect(loginUrl, "push");
    if (joined || joinPending) return;

    setJoinPending(true);

    const success = await joinEvent(event._id);
    setJoined(success);

    setJoinPending(false);
  };

  return (
    <>
      <h1 className="text-2xl font-semibold text-center">{event.title}</h1>
      <div className="flex flex-col-reverse md:flex-row gap-4 md:gap-0 items-stretch md:items-center justify-between">
        <p>{dayjs(event.date).format("dddd, D MMMM YYYY HH:MM WIB")}</p>
        <div className="flex gap-2 justify-end">
          <Button pill outline={!liked} className="w-16" onClick={handleLike}>
            <FaThumbsUp className="text-lg" />
          </Button>
          <Button
            pill
            outline
            className="w-16 text-lg"
            disabled={sharing}
            onClick={handleShare}
          >
            {sharing ? <FaSpinner className="animate-spin" /> : <FaShare />}
          </Button>
          <Button
            pill
            className="w-[160px]"
            disabled={joinPending}
            onClick={handleJoin}
          >
            <div className="text-lg mr-2">
              {joinPending ? (
                <FaSpinner className="animate-spin" />
              ) : joined ? (
                <FaCheck />
              ) : (
                <FaUserPlus />
              )}
            </div>
            {event.type === "seminar" ? "Ikuti Seminar" : "Daftar Kompetisi"}
          </Button>
        </div>
      </div>
      <Image
        alt={event.title!}
        src={urlFor(event.thumbnail!).url()}
        width={1920}
        height={1080}
        loading="eager"
        className="w-full aspect-video self-center"
      />
    </>
  );
}
