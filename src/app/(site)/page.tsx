import { Suspense } from "react";
import { fetchData } from "./actions";
import EventList from "./event-list";

export default async function HomePage() {
  const seminar = fetchData("seminar");

  return (
    <div className="flex flex-col w-full max-w-7xl px-2 py-4 md:px-4 md:py-6 self-center">
      <Suspense fallback={"LOADING..."}>
        <EventList data={seminar} />
      </Suspense>
    </div>
  );
}
