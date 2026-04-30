import { notFound } from "next/navigation";
import type { PropsWithChildren } from "react";
import { PostTypes, type PostsRouteParams } from ".";

export type PagesLayoutProps = PropsWithChildren<{
  params: Promise<PostsRouteParams>;
}>;

export default async function PagesLayout(props: PagesLayoutProps) {
  const { type } = await props.params;
  if (!PostTypes.includes(type)) notFound();
  return props.children;
}
