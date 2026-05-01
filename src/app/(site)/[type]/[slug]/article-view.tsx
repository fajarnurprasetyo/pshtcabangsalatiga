"use client";

import { urlFor } from "@/sanity/image";
import type { PropsWithNullableSession } from "@/types/react";
import dayjs from "dayjs";
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
  useViewUpdater(article._id);

  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <div className="text-2xl font-semibold text-center">{article.title}</div>

      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex gap-1 items-center">
            <Link href="/" className="font-semibold text-blue-600">
              <FaHouse />
            </Link>
          </div>
          <div className="text-sm text-gray-700">
            {dayjs(article.date).format("dddd, D MMMM YYYY HH:MM WIB")}
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
            className="flex items-center justify-center size-8 md:size-9 border border-primary text-primary rounded-full"
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
          className="w-full aspect-video rounded-md"
          src={urlFor(article.thumbnail).url()}
          alt="Event thumbnail"
        />
      )}
    </div>
  );
}
