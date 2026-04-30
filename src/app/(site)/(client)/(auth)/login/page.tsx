"use client";

import { Button, HR, Label, TextInput } from "flowbite-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { use, useActionState } from "react";
import { FaSpinner } from "react-icons/fa6";

export interface LoginPageProps {
  searchParams: Promise<{ callbackUrl?: string }>;
}

export default function LoginPage(props: LoginPageProps) {
  const { callbackUrl = "/" } = use(props.searchParams);

  const handleSignin = async (_: void, formData: FormData) => {
    const res = await signIn("credentials", {
      username: formData.get("username"),
      password: formData.get("password"),
      redirect: false,
    });

    if (res?.ok) redirect(callbackUrl ?? "/");

    alert("Nama pengguna atau kata sandi tidak cocok!");
  };

  const [, submit, isPending] = useActionState(handleSignin, undefined);

  return (
    <div className="flex justify-center">
      <main className="max-w-2xl w-full px-8 sm:px-16 py-10 sm:py-16">
        <h1 className="text-3xl font-semibold text-center select-none">
          Masuk
        </h1>

        <HR />

        <form action={submit} className="flex flex-col gap-4">
          {/* Username */}
          <div>
            <Label htmlFor="input-username" className="block mb-2">
              Nama Pengguna
            </Label>
            <TextInput
              required
              id="input-username"
              name="username"
              type="text"
              placeholder="johndoe"
            />
          </div>

          {/* Password */}
          <div>
            <Label htmlFor="input-password" className="block mb-2">
              Kata Sandi
            </Label>
            <TextInput
              required
              id="input-password"
              type="password"
              // type={showPassword ? "text" : "password"}
              name="password"
              // value={password}
              // onChange={({ target }) => setPassword(target.value)}
            />
          </div>

          <Button type="submit" className="mt-3" disabled={isPending}>
            {isPending ? <FaSpinner className="animate-spin" /> : "Masuk"}
          </Button>
        </form>

        <div className="flex items-center gap-4">
          <HR className="flex-1" />
          <span className="text-sm select-none">atau</span>
          <HR className="flex-1" />
        </div>

        <p className="text-sm text-center select-none">
          Belum punya akun?&nbsp;
          <Link
            href={`/register?callbackUrl=${callbackUrl}`}
            className="font-medium text-blue-600 hover:underline"
          >
            Daftar sekarang
          </Link>
        </p>
      </main>
    </div>
  );
}
