"use client";

import { Button, HR, Label, TextInput } from "flowbite-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import React from "react";

export default function LoginPage(props: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const searchParams = React.use(props.searchParams);

  const handleSignin = async (_: void, formData: FormData) => {
    await signIn("credentials", {
      username: formData.get("username"),
      password: formData.get("password"),
      callbackUrl: searchParams.callbackUrl ?? "/",
    });
  };

  const [, submit, isPending] = React.useActionState(handleSignin, undefined);

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

          <Button
            type="submit"
            className="mt-3 cursor-pointer"
            disabled={isPending}
          >
            Masuk
          </Button>
        </form>

        <div className="flex items-center gap-4">
          <HR className="flex-1" />
          <span className="text-sm select-none">atau</span>
          <HR className="flex-1" />
        </div>

        {/* <button className="w-full rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 cursor-pointer">
          <GoogleIcon className="inline-block w-5 h-5 mr-2" />
          Sign up with Google
        </button> */}

        <p className="text-sm text-center select-none">
          Belum punya akun?&nbsp;
          <Link
            href="/register"
            className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            Daftar sekarang
          </Link>
        </p>
      </main>
    </div>
  );
}
