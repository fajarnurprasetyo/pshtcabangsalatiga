import { usePathname } from "next/navigation";

export default function useLoginUrl() {
  const pathname = usePathname();
  return `/login?callbackUrl=${encodeURIComponent(pathname)}`;
}
