import { type PostsRouteParams } from ".";

export interface PostsPageProps {
  params: Promise<PostsRouteParams>;
}

export default async function PostsPage() {
  return "404: Not found";
}
