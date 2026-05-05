import type { PostsRouteParams } from "..";

export interface PostRouteParams extends PostsRouteParams {
  slug: string;
}

export interface PostRouteProps {
  params: Promise<PostRouteParams>;
}
