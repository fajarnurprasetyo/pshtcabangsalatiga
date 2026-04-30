import { notFound } from "next/navigation";
import type { PropsWithChildren } from "react";
import { PostType, type PostsRouteParams } from ".";

export type PagesLayoutProps = PropsWithChildren<{
  params: Promise<PostsRouteParams>;
}>;

export const PostTypes = [PostType.article, PostType.event] as string[];

export default async function PagesLayout(props: PagesLayoutProps) {
  const { type } = await props.params;
  if (!PostTypes.includes(type)) notFound();
  return props.children;
}
