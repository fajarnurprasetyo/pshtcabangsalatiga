import { auth } from "@/libs/auth";
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

  const imageUrl = urlFor(post.image!).width(1200).url();

  return {
    title: post.title!,
    openGraph: {
      title: post.title!,
      images: imageUrl,
    },
  };
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
