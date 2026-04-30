"use client";

import useDownloadCertificateModal from "@/hooks/modals/useDownloadCertificateModal";
import useLoginUrl from "@/hooks/useLoginUrl";
import useSession from "@/hooks/useSession";
import { urlFor } from "@/libs/sanity/image";
import type { PropsWithNullableSession } from "@/types/react";
import dayjs from "dayjs";
import "dayjs/locale/id";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect, usePathname, useRouter } from "next/navigation";
import { use } from "react";
import {
  FaCheck,
  FaChevronRight,
  FaDownload,
  FaHouse,
  FaRegCalendarCheck,
  FaShare,
  FaSpinner,
  FaThumbsUp,
  FaUserPlus,
} from "react-icons/fa6";
import { useBoolean } from "react-use";
import { joinEvent, updateLikeEvent, type getEvent } from "./actions";

dayjs.locale("id");

export type EventViewProps = PropsWithNullableSession<{
  event: ReturnType<typeof getEvent>;
}>;

export default function EventView(props: EventViewProps) {
  const event = use(props.event);
  if (!event) notFound();

  const router = useRouter();
  const pathname = usePathname();
  const loginUrl = useLoginUrl();

  const { downloadCertificate } = useDownloadCertificateModal();

  const [liked, setLiked] = useBoolean(false);
  const [likePending, setLikePending] = useBoolean(false);

  const [joined, setJoined] = useBoolean(false);
  const [joinPending, setJoinPending] = useBoolean(false);

  const now = dayjs();
  const startDate = dayjs(event.startDate);
  const finishDate = dayjs(event.finishDate ?? event.startDate);

  const eventStarted = startDate.isValid() && now.isAfter(startDate);
  const eventPassed =
    finishDate.isValid() &&
    (event.fullDay
      ? now.startOf("day").isAfter(finishDate.startOf("day"))
      : now.isAfter(finishDate));

  console.log(now.toISOString(), finishDate.toISOString());

  const { data: session } = useSession(props.session, {
    required: false,
    onSignIn({ user: { id } }) {
      setLiked(event.likes.some(({ userId }) => userId === id));
      setJoined(event.participants.some(({ userId }) => userId === id));
    },
    onSignOut() {
      setLiked(false);
      setJoined(false);
    },
  });

  const handleLike = async () => {
    if (!session) redirect(loginUrl, "push");
    if (likePending) return;

    setLikePending(true);

    const next = !liked;
    setLiked(next);
    const update = await updateLikeEvent(event._id, next);

    if (update !== next) setLiked(update);
    else router.refresh();

    setLikePending(false);
  };

  const handleJoin = async () => {
    if (!session) redirect(loginUrl, "push");
    if (joined || joinPending) return;

    setJoinPending(true);

    const success = await joinEvent(event._id);
    if (success) {
      setJoined(true);
      router.refresh();
    }

    setJoinPending(false);
  };

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <div className="text-2xl font-semibold text-center">{event.title}</div>

      <div className="flex flex-col-reverse md:flex-row gap-4 md:gap-0 items-stretch md:items-center justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex gap-1 items-center">
            <Link href="/" className="font-semibold text-blue-600">
              <FaHouse />
            </Link>
            <FaChevronRight />
            <Link
              // `/event?t=${event.type}`
              href="#"
              className="font-semibold text-blue-600"
            >
              {event.type === "seminar" ? "Seminar" : "Kompetisi"}
            </Link>
          </div>
          <div className="text-sm text-gray-700">
            {dayjs(event.date).format("dddd, D MMMM YYYY HH:MM WIB")}
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <button
            onClick={handleLike}
            className={`flex items-center justify-center size-8 md:size-9 border border-primary ${
              liked
                ? "bg-primary hover:bg-primary-800 text-white"
                : "hover:bg-primary-200 text-primary"
            } rounded-full`}
          >
            <FaThumbsUp />
          </button>
          <button
            className="flex items-center justify-center size-8 md:size-9 border border-primary text-primary rounded-full"
            onClick={() =>
              navigator.share({ title: event.title || pathname, url: pathname })
            }
          >
            <FaShare />
          </button>
        </div>
      </div>

      {event.thumbnail && (
        <Image
          width={1920}
          height={1080}
          loading="eager"
          className="w-full aspect-video rounded-md"
          src={urlFor(event.thumbnail).url()}
          alt="Event thumbnail"
        />
      )}

      <div className="flex flex-col sm:flex-row gap-2 md:gap-0 items-center md:items-start justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center">
            <FaRegCalendarCheck className="mr-2" />
            {dayjs(event.startDate).format("DD MMMM YYYY HH:MM WIB")}
          </div>
        </div>
        {!eventStarted && (
          <button
            onClick={handleJoin}
            disabled={joinPending}
            className="h-9 md:h-10 px-4 bg-primary text-white rounded-full"
          >
            <div className="mr-2">
              {joinPending ? (
                <FaSpinner className="animate-spin" />
              ) : joined ? (
                <FaCheck />
              ) : (
                <FaUserPlus />
              )}
            </div>
            Daftar
          </button>
        )}
        {event.hasCertificate && eventPassed && joined && (
          <button
            onClick={() =>
              downloadCertificate(session!.user, event._id, event.title)
            }
            className="h-9 md:h-10 px-4 bg-primary text-white rounded-full"
          >
            <div className="mr-2">
              <FaDownload />
            </div>
            Unduh Sertifikat
          </button>
        )}
      </div>
    </div>
  );
}
