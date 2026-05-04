import type { JSX } from "react";
import { twMerge } from "tailwind-merge";

export function Container({
  className,
  ...props
}: JSX.IntrinsicElements["div"]) {
  return (
    <div
      {...props}
      className={twMerge(
        "flex flex-col flex-1 self-center bg-white shadow-lg px-2 md:px-4 py-4 md:py-6 w-full max-w-7xl",
        className,
      )}
    />
  );
}
