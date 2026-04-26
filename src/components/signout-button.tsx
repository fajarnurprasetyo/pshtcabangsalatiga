"use client";

import { Button, type ButtonProps } from "flowbite-react";
import { signOut, type SignOutParams } from "next-auth/react";

export type SignOutButtonProps<R extends boolean = true> = ButtonProps & {
  signOutOptions?: SignOutParams<R>;
};

export default function SignOutButton<R extends boolean = true>({
  onClick,
  signOutOptions,
  ...props
}: SignOutButtonProps<R>) {
  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);

    if (!event.defaultPrevented) {
      await signOut(signOutOptions);
    }
  };

  return <Button {...props} onClick={handleClick} />;
}
