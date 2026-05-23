"use client";

import { Container } from "@/components/Container";
import type { ProviderId } from "@auth/core/providers";
import { Button, Checkbox, HR, Label, TextInput } from "flowbite-react";
import { signIn, type SignInOptions } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useActionState } from "react";
import { FaFacebookF, FaGoogle } from "react-icons/fa6";
import { HiKey, HiUser } from "react-icons/hi2";
import { useBoolean, useCookie } from "react-use";

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const [rememberCookie, setRememberCookie] = useCookie("remember-session");
  const setRemember = (value: boolean) =>
    setRememberCookie(JSON.stringify(value));
  const remember = rememberCookie === "true";

  const [loading, setLoading] = useBoolean(false);

  const handleSignIn = async (
    provider: ProviderId,
    options?: SignInOptions,
  ) => {
    setLoading(true);
    await signIn(provider, { ...options, redirectTo: callbackUrl });
    setLoading(false);
  };

  const [, submit] = useActionState(async (_: void, formData: FormData) => {
    await handleSignIn("credentials", {
      login: formData.get("login"),
      password: formData.get("password"),
      remember: true,
    });
  }, undefined);

  return (
    <main className="flex flex-1 justify-center items-center h-dvh">
      <Container className="rounded-xl max-w-sm">
        <h1 className="font-semibold text-3xl text-center select-none">
          Masuk
        </h1>

        <HR />

        <form action={submit} className="flex flex-col gap-4">
          <TextInput
            required
            autoFocus
            type="text"
            name="login"
            icon={HiUser}
            placeholder="Nama Pengguna / Email / Telepon"
          />

          <TextInput
            required
            type="password"
            name="password"
            icon={HiKey}
            placeholder="Kata Sandi"
          />

          <div className="flex justify-between items-center select-none">
            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={remember}
                onChange={({ target }) => setRemember(target.checked)}
              />
              <Label htmlFor="remember">Ingat saya</Label>
            </div>
            <button className="focus:outline-0 text-primary-700 text-sm hover:underline focus:underline cursor-pointer">
              Lupa kata sandi?
            </button>
          </div>

          <Button type="submit" disabled={loading}>
            Masuk
          </Button>
        </form>

        <div hidden className="flex items-center gap-4">
          <HR className="flex-1" />
          <span className="text-sm select-none">atau</span>
          <HR className="flex-1" />
        </div>

        <div hidden className="flex flex-col gap-3">
          <Button
            color="alternative"
            disabled={loading}
            className="gap-2"
            onClick={() => handleSignIn("google")}
          >
            <FaGoogle />
            Masuk dengan Google
          </Button>

          <Button
            color="alternative"
            disabled={loading}
            className="gap-2"
            onClick={() => handleSignIn("facebook")}
          >
            <FaFacebookF />
            Masuk dengan Facebook
          </Button>

          <p className="text-sm text-center select-none">
            Belum punya akun?&nbsp;
            <Link
              href={`/register?callbackUrl=${callbackUrl}`}
              className="font-medium text-primary-700 hover:underline"
            >
              Daftar sekarang
            </Link>
          </p>
        </div>
      </Container>
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
