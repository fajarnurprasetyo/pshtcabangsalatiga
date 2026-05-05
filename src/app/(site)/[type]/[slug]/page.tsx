import { auth } from "@/libs/auth";
import type { Metadata, ResolvingMetadata } from "next";
import { Suspense } from "react";
import { type PostsRouteParams } from "..";
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
  const parentMetadata = await parent;
  const { type, slug } = await params;

  const post =
    type === "artikel" ? await getArticle(slug) : await getEvent(slug);

  return post
    ? {
        title: post.title!,
        openGraph: {
          title: post.title!,
        },
      }
    : (parentMetadata as Metadata);
}

export default async function PostPage(props: PostPageProps) {
  const session = await auth();
  const { type, slug } = await props.params;

  return (
    <Suspense fallback={<PostLoadingView type={type} />}>
      {type === "artikel" ? (
        <ArticleView session={session} article={getArticle(slug, true)} />
      ) : (
        <EventView session={session} event={getEvent(slug, true)} />
      )}
    </Suspense>
  );
}
