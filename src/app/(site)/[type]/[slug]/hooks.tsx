import { useTimeoutFn, useUnmount } from "react-use";
import { updatePostView } from "./actions";

export function useViewUpdater(type: string, postId: string) {
  const [, cancel] = useTimeoutFn(() => updatePostView(type, postId), 10_000);
  useUnmount(cancel);
}
