import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col flex-1 justify-center items-center gap-2">
      <h2 className="font-semibold text-2xl">404: Not Found</h2>
      <div>
        <span>Could not find requested resource.</span>
        <Link href="/" className="ml-2 text-blue-700 hover:underline">
          Return Home
        </Link>
      </div>
    </div>
  );
}
