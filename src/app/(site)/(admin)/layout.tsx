"use server";

import { UserRole } from "@/generated/prisma/enums";
import { authOptions } from "@/libs/next-auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import type { PropsWithChildren } from "react";
import "./globals.css";

export default async function AdminLayout({ children }: PropsWithChildren) {
  const session = await getServerSession(authOptions);

  if (!session?.user.roles.includes(UserRole.ADMIN)) {
    notFound();
  }

  return (
    <html lang="id" className="antialiased">
      <body className="min-h-[100dvh]">{children}</body>
    </html>
  );
}
