import { authOptions } from "@/libs/next-auth";
import client from "@/libs/sanity/queries/client";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import React, { Suspense } from "react";
import { fetchData } from "./actions";
import SeminarView from "./event-view";

export interface SeminarPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(
  { params }: SeminarPageProps,
  // parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = await params;
  const event = await client.fetch(
    `*[_type == "event" && slug.current == "${slug}"][0]{title}`,
  );

  return {
    title: event?.title,
    // description: event?.description,
  };
}
export default function SeminarPage(props: SeminarPageProps) {
  const session = getServerSession(authOptions);
  const { slug } = React.use(props.params);
  const data = fetchData(slug);

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <Suspense fallback={"LOADING..."}>
        <SeminarView session={session} data={data} />
      </Suspense>
    </div>
  );
}
