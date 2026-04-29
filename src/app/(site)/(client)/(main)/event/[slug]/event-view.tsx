"use client";

import useDownloadCertificateModal from "@/hooks/modals/useDownloadCertificateModal";
import useLoginUrl from "@/hooks/useLoginUrl";
import useSession from "@/hooks/useSession";
import { urlFor } from "@/libs/sanity/image";
import type { PropsWithNullableSession } from "@/types/react";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { Button } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import { redirect, usePathname, useRouter } from "next/navigation";
import {
  FaCheck,
  FaChevronRight,
  FaClock,
  FaDownload,
  FaHouse,
  FaShare,
  FaSpinner,
  FaThumbsUp,
  FaUserPlus,
} from "react-icons/fa6";
import { useBoolean } from "react-use";
import { joinEvent, updateLikeEvent, type getEvent } from "./actions";

dayjs.locale("id");

export type EventViewProps = PropsWithNullableSession<{
  event: NonNullable<Awaited<ReturnType<typeof getEvent>>>;
}>;

export default function EventView(props: EventViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const loginUrl = useLoginUrl();

  const { downloadCertificate } = useDownloadCertificateModal();

  const [liked, setLiked] = useBoolean(false);
  const [likePending, setLikePending] = useBoolean(false);

  const [sharing, setSharing] = useBoolean(false);

  const [joined, setJoined] = useBoolean(false);
  const [joinPending, setJoinPending] = useBoolean(false);

  const {
    event: { title, likes, participants, hasCertificate, ...event },
  } = props;

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
      setLiked(likes.some(({ userId }) => userId === id));
      setJoined(participants.some(({ userId }) => userId === id));
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

  const handleShare = async () => {
    setSharing(true);
    await navigator.share({ title: title ?? pathname, url: pathname }).catch();
    setSharing(false);
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
    <>
      <h1 className="text-2xl font-semibold text-center">{title}</h1>
      <div className="flex flex-col-reverse md:flex-row gap-4 md:gap-0 items-stretch md:items-center justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex gap-1 items-center">
            <Link
              href="/"
              className="font-semibold text-blue-600 dark:text-blue-500"
            >
              <FaHouse />
            </Link>
            <FaChevronRight />
            <Link
              // `/event?t=${event.type}`
              href="#"
              className="font-semibold text-blue-600 dark:text-blue-500"
            >
              {event.type === "seminar" ? "Seminar" : "Kompetisi"}
            </Link>
          </div>
          <div className="text-sm text-gray-700 dark:text-gray-500">
            {dayjs(event.date).format("dddd, D MMMM YYYY HH:MM WIB")}
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <Button
            pill
            outline={!liked}
            className="w-9 h-9 p-0 focus:ring-0"
            onClick={handleLike}
          >
            <FaThumbsUp />
          </Button>
          <Button
            pill
            outline
            className="w-9 h-9 p-0 focus:ring-0"
            disabled={sharing}
            onClick={handleShare}
          >
            {sharing ? <FaSpinner className="animate-spin" /> : <FaShare />}
          </Button>
        </div>
      </div>
      {event.thumbnail && (
        <Image
          alt="Event thumbnail"
          src={urlFor(event.thumbnail).url()}
          width={1920}
          height={1080}
          loading="eager"
          className="w-full aspect-video self-center"
        />
      )}

      <div className="flex flex-col sm:flex-row gap-2 md:gap-0 items-center md:items-start justify-between">
        <div className="flex flex-col gap-1">
          <p className="flex items-center">
            <FaClock className="mr-2" />
            {dayjs(event.startDate).format("DD MMMM YYYY HH:MM WIB")}
          </p>
        </div>
        <div className="flex gap-2">
          {!eventStarted && (
            <Button
              pill
              size="sm"
              className="px-4"
              onClick={handleJoin}
              disabled={joinPending}
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
            </Button>
          )}
          {hasCertificate && eventPassed && joined && (
            <Button
              pill
              size="sm"
              className="px-4"
              onClick={() => downloadCertificate(session!.user, event)}
            >
              <div className="mr-2">
                <FaDownload />
              </div>
              Unduh Sertifikat
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
