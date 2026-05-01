import { notFound } from "next/navigation";
import { use, type PropsWithChildren } from "react";
import { PostType, type PostsRouteParams } from ".";

export type PagesLayoutProps = PropsWithChildren<{
  params: Promise<PostsRouteParams>;
}>;

export const PostTypes = [PostType.article, PostType.event] as string[];

export default function PagesLayout({ params, children }: PagesLayoutProps) {
  const { type } = use(params);
  if (!PostTypes.includes(type)) notFound();

  return (
    <div className="flex flex-col self-center px-2 md:px-4 py-4 md:py-6 w-full max-w-7xl">
      {children}
    </div>
  );
}
