import { faker } from "@faker-js/faker";
import _ from "lodash";
import { useMemo } from "react";

export interface PostLoadingPageProps {
  type: string;
}

export default function PostLoadingView({ type }: PostLoadingPageProps) {
  const isEvent = type === "kegiatan";

  const fakeTitle = useMemo(() => {
    const length = faker.number.int({ min: 5, max: 8 });
    return Array.from({ length }, () => _.startCase(faker.word.noun()));
  }, []);

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <div className="flex flex-wrap justify-center gap-2">
        {fakeTitle.map((word, i) => (
          <div
            key={i}
            className="bg-gray-300 rounded font-semibold text-transparent text-2xl animate-pulse"
          >
            {word}
          </div>
        ))}
      </div>

      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            &nbsp;
            {/* <Link href="/" className="font-semibold text-blue-600">
              <FaHouse />
            </Link>
            <FaChevronRight />
            <Link
              // `/event?t=${event.type}`
              href="#"
              className="font-semibold text-blue-600"
            >
              {event.type === "seminar" ? "Seminar" : "Kompetisi"}
            </Link> */}
          </div>
          <div className="bg-gray-300 rounded text-transparent text-sm animate-pulse">
            Minggu, 09 September 2009 09:09 WIB
          </div>
        </div>
        <div className="flex gap-2">
          <div
            className={`animate-pulse size-8 md:size-9 border border-gray-300 bg-gray-300 rounded-full`}
          />
          <div
            className={`animate-pulse size-8 md:size-9 border border-gray-300 bg-gray-300 rounded-full`}
          />
        </div>
      </div>

      <div className="bg-gray-300 rounded-md aspect-video animate-pulse W-FULL" />

      <div className="flex sm:flex-row flex-col justify-between items-center md:items-start gap-2 md:gap-0">
        <div className="flex flex-col items-start gap-1">
          <div className="bg-gray-300 pl-6 rounded text-transparent animate-pulse">
            Minggu, 09 September 2009 09:09 WIB
          </div>
        </div>
        {isEvent && (
          <div className="bg-gray-300 rounded-full w-40 h-9 md:h-10 animate-pulse" />
        )}
      </div>
    </div>
  );
}
