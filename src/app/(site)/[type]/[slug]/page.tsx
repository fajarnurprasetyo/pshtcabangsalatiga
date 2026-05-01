import { auth } from "@/auth";
import { fetchArticleTitle, fetchEventTitle } from "@/sanity/queries";
import type { Metadata, ResolvingMetadata } from "next";
import { Suspense } from "react";
import { PostType, type PostsRouteParams } from "../";
import { getArticle, getEvent } from "./actions";
import ArticleView from "./article-view";
import EventView from "./event-view";
import PostLoadingView from "./loading-view";

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
  const session = await auth();
  const { type, slug } = await props.params;

  return (
    <Suspense fallback={<PostLoadingView type={type} />}>
      {type === PostType.article ? (
        <ArticleView session={session} article={getArticle(slug)} />
      ) : (
        <EventView session={session} event={getEvent(slug)} />
      )}
    </Suspense>
  );
}
