import { getSession } from "@/libs/react";
import { urlFor } from "@/sanity/image";
import type { Metadata } from "next";
import { Suspense } from "react";
import { type PostsRouteParams } from "..";
import { getArticle, getEvent } from "./actions";
import ArticleView from "./article-view";
import EventView from "./event-view";
import PostLoadingView from "./loading-view";

export interface PostPageProps {
  params: Promise<PostsRouteParams & { slug: string }>;
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { type, slug } = await params;

  const post =
    type === "artikel" ? await getArticle(slug) : await getEvent(slug);

  if (!post) return {};

  const ogImageUrl = urlFor(post.image!)
    .width(1200)
    .height(630)
    .format("jpg")
    .url();

  return {
    title: post.title!,
    description: post.description ?? undefined,
    openGraph: {
      title: post.title!,
      description: post.description ?? undefined,
      images: ogImageUrl,
    },
  };
}

export default async function PostPage(props: PostPageProps) {
  const session = await getSession();
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
