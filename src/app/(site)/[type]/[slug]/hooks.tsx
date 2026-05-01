import { useTimeoutFn, useUnmount } from "react-use";
import { updatePostView } from "./actions";

export function useViewUpdater(postId: string) {
  const [, cancel] = useTimeoutFn(() => updatePostView(postId), 10_000);
  useUnmount(cancel);
}
