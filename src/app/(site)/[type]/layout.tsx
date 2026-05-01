import { notFound } from "next/navigation";
import type { PropsWithChildren } from "react";
import { PostType, type PostsRouteParams } from ".";

export type PagesLayoutProps = PropsWithChildren<{
  params: Promise<PostsRouteParams>;
}>;

export const PostTypes = [PostType.article, PostType.event] as string[];

export default async function PagesLayout({
  params,
  children,
}: PagesLayoutProps) {
  const { type } = await params;
  if (!PostTypes.includes(type)) notFound();

  return (
    <div className="flex flex-col w-full max-w-7xl px-2 py-4 md:px-4 md:py-6 self-center">
      {children}
    </div>
  );
}
