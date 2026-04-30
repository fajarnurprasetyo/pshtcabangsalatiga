import { notFound } from "next/navigation";
import { type PostsRouteParams } from ".";

export interface PostsPageProps {
  params: Promise<PostsRouteParams>;
}

export default async function PostsPage() {
  notFound();
}
