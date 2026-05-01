import type { Session } from "next-auth";
import { useSession as use } from "next-auth/react";
import { useEffect, useRef } from "react";

export interface UseSessionOptions {
  onSignIn?: (session: Session) => void;
  onSignOut?: () => void;
}

export default function useSession(
  serverSession: Session | null,
  options: UseSessionOptions,
) {
  const sessionState = use();

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
