import { useCookie, useTimeoutFn, useUnmount } from "react-use";
import { updatePostView } from "./actions";

export function useViewUpdater(type: string, postId: string) {
  const [cookie] = useCookie(`${type}:${postId}:view`);

  const [, cancel] = useTimeoutFn(() => {
    if (cookie) return;
    updatePostView(type, postId);
  }, 10_000);

  useUnmount(cancel);
}
