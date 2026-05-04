import { Container } from "@/components/Container";
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
  return <Container>{children}</Container>;
}
