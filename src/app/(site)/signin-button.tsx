"use client";

import useLoginUrl from "@/hooks/useLoginUrl";
import { Button } from "flowbite-react";
import { useRouter } from "next/navigation";
import { CgSpinner } from "react-icons/cg";
import { HiArrowRightEndOnRectangle } from "react-icons/hi2";
import { useBoolean } from "react-use";

export default function SignInButton() {
  const router = useRouter();
  const loginUrl = useLoginUrl();
  const [loading, setLoading] = useBoolean(false);

  return (
    <Button
      disabled={loading}
      className="gap-2 px-3 md:px-5 focus:ring-0 h-9 md:h-12 text-xs md:text-base"
      onClick={() => {
        setLoading(true);
        router.push(loginUrl);
      }}
    >
      {loading ? (
        <CgSpinner className="animate-spin" />
      ) : (
        <HiArrowRightEndOnRectangle />
      )}
      Masuk
    </Button>
  );
}
