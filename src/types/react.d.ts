import type { Session } from "next-auth";

export type PropsWithNullableSession<P = unknown> = P & {
  session: Session | null;
};
