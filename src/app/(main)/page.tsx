"use client";

import { Button } from "flowbite-react";
import { signOut } from "next-auth/react";

export default function HomePage() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <Button onClick={() => signOut({ callbackUrl: "/login" })}>
        Sign Out
      </Button>
    </div>
  );
}
