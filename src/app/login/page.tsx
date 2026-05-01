"use client";

import { Button, HR, TextInput } from "flowbite-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense, useActionState } from "react";
import { FaSpinner } from "react-icons/fa6";
import { HiKey, HiUser } from "react-icons/hi2";

interface FormProps {
  callbackUrl?: string;
}

function Form({ callbackUrl }: FormProps) {
  const handleSignin = async (_: void, formData: FormData) => {
    const res = await signIn("credentials", {
      username: formData.get("username"),
      password: formData.get("password"),
      redirect: false,
    });

    if (res?.ok) redirect(callbackUrl || "/");

    alert("Nama pengguna atau kata sandi tidak cocok!");
  };

  const [, submit, isPending] = useActionState(handleSignin, undefined);

  return (
    <form action={submit} className="flex flex-col gap-4">
      <TextInput
        required
        autoFocus
        type="text"
        name="username"
        icon={HiUser}
        placeholder="Nama Pengguna"
      />

      <TextInput
        required
        type="password"
        name="password"
        icon={HiKey}
        placeholder="Kata Sandi"
      />

      <Button type="submit" disabled={isPending}>
        {isPending ? <FaSpinner className="animate-spin" /> : "Masuk"}
      </Button>
    </form>
  );
}

export interface LoginPageProps {
  searchParams: Promise<FormProps>;
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  return (
    <Suspense>
      {searchParams.then(({ callbackUrl }) => (
        <main className="flex flex-col self-center px-8 sm:px-16 py-10 sm:py-16 w-full max-w-2xl">
          <h1 className="font-semibold text-3xl text-center select-none">
            Masuk
          </h1>

          <HR />

          <Form callbackUrl={callbackUrl} />

          <div className="flex items-center gap-4">
            <HR className="flex-1" />
            <span className="text-sm select-none">atau</span>
            <HR className="flex-1" />
          </div>

          <p className="text-sm text-center select-none">
            Belum punya akun?&nbsp;
            <Link
              href={`/register?callbackUrl=${callbackUrl}`}
              className="font-medium text-primary-700 hover:underline"
            >
              Daftar sekarang
            </Link>
          </p>
        </main>
      ))}
    </Suspense>
  );
}
