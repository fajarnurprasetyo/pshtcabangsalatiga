export enum PostType {
  article = "artikel",
  event = "kegiatan",
}

export interface PostsRouteParams {
  type: string;
}
