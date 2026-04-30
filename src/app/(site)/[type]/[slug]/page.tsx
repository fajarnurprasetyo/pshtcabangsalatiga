import { authOptions } from "@/libs/next-auth";
import { fetchArticleTitle, fetchEventTitle } from "@/libs/sanity/queries";
import type { Metadata, ResolvingMetadata } from "next";
import { getServerSession } from "next-auth";
import { Suspense } from "react";
import { PostType, type PostsRouteParams } from "../";
import { getArticle, getEvent } from "./actions";
import ArticleView from "./article-view";
import EventView from "./event-view";

export interface PostPageProps {
  params: Promise<PostsRouteParams & { slug: string }>;
}

export async function generateMetadata(
  { params }: PostPageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { type, slug } = await params;

  const postTitle =
    type === PostType.article
      ? await fetchArticleTitle(slug)
      : await fetchEventTitle(slug);

  return {
    title: postTitle || (await parent).title?.absolute,
  };
}

export default async function PostPage(props: PostPageProps) {
  const { type, slug } = await props.params;
  const session = await getServerSession(authOptions);

  return (
    <Suspense>
      {type === PostType.article ? (
        <ArticleView session={session} article={getArticle(slug)} />
      ) : (
        <EventView session={session} event={getEvent(slug)} />
      )}
    </Suspense>
  );
}
