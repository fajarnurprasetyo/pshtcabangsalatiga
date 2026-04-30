export enum PostType {
  article = "artikel",
  event = "kegiatan",
}

export const PostTypes = [PostType.article, PostType.event] as string[];

export interface PostsRouteParams {
  type: PostType;
}
