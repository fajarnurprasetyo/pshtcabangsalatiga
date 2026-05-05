import { Container } from "@/components/Container";
import { notFound } from "next/navigation";
import { use, type PropsWithChildren } from "react";
import type { PostsRouteProps } from ".";

export const PostTypes = ["artikel", "kegiatan"];

export default function PostsLayout({
  params,
  children,
}: PropsWithChildren<PostsRouteProps>) {
  const { type } = use(params);
  if (!PostTypes.includes(type)) notFound();
  return <Container>{children}</Container>;
}
