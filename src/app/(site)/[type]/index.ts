export interface PostsRouteParams {
  type: string;
}

export interface PostsRouteProps {
  params: Promise<PostsRouteParams>;
}
