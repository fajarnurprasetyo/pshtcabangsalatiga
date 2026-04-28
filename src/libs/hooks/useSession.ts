import type { Session } from "next-auth";
import {
  useSession as use,
  type UseSessionOptions as Options,
  type SessionContextValue,
} from "next-auth/react";
import { useEffect, useRef } from "react";

export type UseSessionOptions<R extends boolean> = Options<R> & {
  onSignIn?: (session: Session) => void;
  onSignOut?: () => void;
};

export default function useSession<R extends boolean>(
  options?: UseSessionOptions<R>,
): SessionContextValue<R>;
export default function useSession<R extends boolean>(
  serverSession: Session | null,
  options?: UseSessionOptions<R>,
): SessionContextValue<R>;
export default function useSession<R extends boolean>(
  arg_0?: UseSessionOptions<R> | Session | null,
  arg_1?: UseSessionOptions<R>,
) {
  let serverSession: Session | null | undefined;
  let options: UseSessionOptions<R> | undefined;

  if (arg_0 && "required" in arg_0) {
    options = arg_0;
  } else {
    serverSession = arg_0 as Session | null;
    options = arg_1;
  }

  const sessionState = use(options);

  const data =
    sessionState.data !== undefined ? sessionState.data : serverSession;

  const prevRef = useRef<Session | null>(undefined);

  useEffect(() => {
    const prev = prevRef.current;
    if (!prev && data) options?.onSignIn?.(data);
    if (prev && !data) options?.onSignOut?.();
    prevRef.current = data;
  }, [data, options]);

  return {
    ...sessionState,
    data: sessionState.data !== undefined ? sessionState.data : serverSession,
  };
}
