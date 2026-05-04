"use client";

import type { ProviderId } from "@auth/core/providers";
import { Button, HR, TextInput } from "flowbite-react";
import { signIn, type SignInOptions } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useActionState } from "react";
import { FaSpinner } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { HiKey, HiUser } from "react-icons/hi2";
import { useCookie } from "react-use";

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const [rememberCookie, setRememberCookie] = useCookie("remember-session");
  const remember = rememberCookie === "true";
  const setRemember = (value: boolean) =>
    setRememberCookie(JSON.stringify(value));

  const handleSignIn = async (provider: ProviderId, options?: SignInOptions) =>
    await signIn(provider, { ...options, redirectTo: callbackUrl });

  const [, submit, isPending] = useActionState(
    async (_: void, formData: FormData) => {
      await handleSignIn("credentials", {
        login: formData.get("login"),
        password: formData.get("password"),
        remember: true,
      });
    },
    undefined,
  );

  return (
    <main className="flex flex-col self-center px-8 sm:px-16 py-10 sm:py-16 w-full max-w-2xl">
      <h1 className="font-semibold text-3xl text-center select-none">Masuk</h1>

      <HR />

      <form action={submit} className="flex flex-col gap-4">
        <TextInput
          required
          autoFocus
          type="text"
          name="login"
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

      <div className="flex items-center gap-4">
        <HR className="flex-1" />
        <span className="text-sm select-none">atau</span>
        <HR className="flex-1" />
      </div>

      <Button
        color="alternative"
        onClick={() => {
          setRemember(true);
          handleSignIn("google");
        }}
      >
        <FcGoogle className="mr-2" />
        Masuk dengan Google
      </Button>

      <p className="mt-4 text-sm text-center select-none">
        Belum punya akun?&nbsp;
        <Link
          href={`/register?callbackUrl=${callbackUrl}`}
          className="font-medium text-primary-700 hover:underline"
        >
          Daftar sekarang
        </Link>
      </p>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
