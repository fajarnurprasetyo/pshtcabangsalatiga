"use client";

import useDownloadCertificateModal from "@/hooks/modals/useDownloadCertificateModal";
import useLoginUrl from "@/hooks/useLoginUrl";
import useSession from "@/hooks/useSession";
import { urlFor } from "@/sanity/image";
import type { PropsWithNullableSession } from "@/types/react";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { Button } from "flowbite-react";
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
import { joinEvent, updateLikePost, type getEvent } from "./actions";
import { useViewUpdater } from "./hooks";

dayjs.locale("id");

export type EventViewProps = PropsWithNullableSession<{
  event: ReturnType<typeof getEvent>;
}>;

export default function EventView(props: EventViewProps) {
  const event = use(props.event);
  if (!event) notFound();
  useViewUpdater("event", event._id);

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

  const { data: session } = useSession(props.session, {
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
    const update = await updateLikePost("event", event._id, next);

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
      <div className="font-semibold text-2xl text-center">{event.title}</div>

      <div className="flex md:flex-row flex-col-reverse justify-between items-stretch md:items-center gap-4 md:gap-0">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <Link href="/" className="font-semibold text-primary-700">
              <FaHouse />
            </Link>
            <FaChevronRight />
            <Link
              // `/event?t=${event.type}`
              href="#"
              className="font-semibold text-primary-700"
            >
              {event.type === "seminar" ? "Seminar" : "Kompetisi"}
            </Link>
          </div>
          <div className="text-gray-700 text-sm">
            pshtcabangsalatiga | {dayjs(event.date).format("MMM D, YYYY")}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button
            pill
            onClick={handleLike}
            className={`p-0 border border-primary-700 focus:ring-0 size-8 md:size-9 ${
              liked
                ? "bg-primary-700 hover:bg-primary-900 text-white"
                : "bg-white hover:bg-primary-200 text-primary-700"
            }`}
          >
            <FaThumbsUp />
          </Button>
          <Button
            pill
            className="bg-white hover:bg-primary-200 p-0 border border-primary-700 focus:ring-0 size-8 md:size-9 text-primary-700"
            onClick={() =>
              navigator.share({ title: event.title || pathname, url: pathname })
            }
          >
            <FaShare />
          </Button>
        </div>
      </div>

      {event.thumbnail && (
        <Image
          width={1920}
          height={1080}
          loading="eager"
          className="rounded-md w-full aspect-video"
          src={urlFor(event.thumbnail).url()}
          alt="Event thumbnail"
        />
      )}

      <div className="flex sm:flex-row flex-col justify-between items-center md:items-start gap-2 md:gap-0">
        <div className="flex flex-col gap-1">
          <div className="flex items-center">
            <FaRegCalendarCheck className="mr-2" />
            {dayjs(event.startDate).format("DD MMMM YYYY HH:mm [WIB]")}
          </div>
        </div>
        {!eventStarted && (
          <Button pill onClick={handleJoin} disabled={joinPending}>
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
        {event.hasCertificate && eventPassed && joined && (
          <Button
            pill
            onClick={() =>
              downloadCertificate(session!.user, event._id, event.title)
            }
          >
            <div className="mr-2">
              <FaDownload />
            </div>
            Unduh Sertifikat
          </Button>
        )}
      </div>
    </div>
  );
}
