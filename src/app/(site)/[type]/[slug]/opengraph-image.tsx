import { urlFor } from "@/sanity/image";
import { ImageResponse } from "next/og";
import type { PostRouteProps } from ".";
import { getArticle, getEvent } from "./actions";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image({ params }: PostRouteProps) {
  const { type, slug } = await params;

  const post =
    type === "artikel" ? await getArticle(slug) : await getEvent(slug);

  if (!post?.image) return null;

  return new ImageResponse(
    <img
      alt={post.title ?? undefined}
      src={urlFor(post.image).width(1200).url()}
    />,
  );
}
