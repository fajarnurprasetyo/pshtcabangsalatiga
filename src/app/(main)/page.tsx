import SignOutButton from "@/components/signout-button";
import { Button } from "flowbite-react";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function HomePage() {
  const session = await getServerSession();

  if (session) {
    return (
      <div className="flex-1 flex flex-col gap-8 items-center justify-center">
        <h1 className="text-2xl">
          Selamat datang,&nbsp;
          <span className="font-bold text-blue-500">{session.user?.name}</span>
        </h1>
        <SignOutButton className="cursor-pointer">Keluar</SignOutButton>
      </div>
    );
  }

  return (
    <div className="flex-1 flex gap-4 items-center justify-center">
      <Link href="/login">
        <Button className="cursor-pointer">Masuk</Button>
      </Link>
      <p className="text-sm">atau</p>
      <Link href="/register">
        <Button className="cursor-pointer">Daftar</Button>
      </Link>
    </div>
  );
}
