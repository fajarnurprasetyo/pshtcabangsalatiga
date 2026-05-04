"use client";

import dayjs from "@/libs/dayjs";
import { urlFor } from "@/sanity/image";
import type { PropsWithNullableSession } from "@/types/react";
import Image from "next/image";
import Link from "next/link";
import { notFound, usePathname } from "next/navigation";
import { use } from "react";
import { FaHouse, FaShare, FaThumbsUp } from "react-icons/fa6";
import type { getArticle } from "./actions";
import { useViewUpdater } from "./hooks";

export type ArticleViewProps = PropsWithNullableSession<{
  article: ReturnType<typeof getArticle>;
}>;

export default function ArticleView(props: ArticleViewProps) {
  const article = use(props.article);
  if (!article) notFound();
  useViewUpdater("article", article._id);

  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <div className="font-semibold text-2xl text-center">{article.title}</div>

      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <Link href="/" className="font-semibold text-blue-600">
              <FaHouse />
            </Link>
          </div>
          <div className="text-gray-700 text-sm">
            {dayjs.tz(article.date).format("dddd, D MMMM YYYY HH:MM WIB")}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            className={`flex items-center justify-center size-8 md:size-9 border border-primary ${
              false
                ? "bg-primary hover:bg-primary-800 text-white"
                : "hover:bg-primary-200 text-primary"
            } rounded-full`}
          >
            <FaThumbsUp />
          </button>
          <button
            className="flex justify-center items-center border border-primary rounded-full size-8 md:size-9 text-primary"
            onClick={() =>
              navigator.share({
                title: article.title || pathname,
                url: pathname,
              })
            }
          >
            <FaShare />
          </button>
        </div>
      </div>

      {article.thumbnail && (
        <Image
          width={1920}
          height={1080}
          loading="eager"
          className="rounded-md w-full aspect-video"
          alt={article.title ?? "Gambar thumbnail"}
          src={urlFor(article.thumbnail).url()}
        />
      )}
    </div>
  );
}
