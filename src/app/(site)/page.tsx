import { Suspense } from "react";
import { fetchData } from "./actions";
import EventList from "./event-list";

export default async function HomePage() {
  const seminar = fetchData("seminar");

  return (
    <div className="flex flex-col w-full max-w-7xl self-center">
      <Suspense fallback={"LOADING..."}>
        <EventList data={seminar} />
      </Suspense>
    </div>
  );
}
