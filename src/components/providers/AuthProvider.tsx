import { getSession } from "@/libs/react";
import { SessionProvider } from "next-auth/react";
import type { PropsWithChildren } from "react";

export default async function AuthProvider({ children }: PropsWithChildren) {
  const session = await getSession();
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
