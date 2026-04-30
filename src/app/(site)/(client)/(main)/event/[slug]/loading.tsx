import { faker } from "@faker-js/faker";
import _ from "lodash";
import Link from "next/link";
import { useMemo } from "react";
import { FaHouse } from "react-icons/fa6";

export default function EventLoadingPage() {
  const fakeTitle = useMemo(() => {
    const length = faker.number.int({ min: 5, max: 8 });
    return Array.from({ length }, () => _.startCase(faker.word.noun()));
  }, []);

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <div className="flex flex-wrap gap-2 justify-center">
        {fakeTitle.map((word, i) => (
          <div
            key={i}
            className="animate-pulse text-2xl font-semibold bg-gray-300 text-transparent rounded"
          >
            {word}
          </div>
        ))}
      </div>

      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex gap-1 items-center">
            <Link href="/" className="font-semibold text-blue-600">
              <FaHouse />
            </Link>
            {/* <FaChevronRight />
            <Link
              // `/event?t=${event.type}`
              href="#"
              className="font-semibold text-blue-600"
            >
              {event.type === "seminar" ? "Seminar" : "Kompetisi"}
            </Link> */}
          </div>
          <div className="animate-pulse bg-gray-300 text-sm text-transparent rounded">
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

      <div className="animate-pulse W-FULL aspect-video bg-gray-300 rounded-md" />

      <div className="flex flex-col sm:flex-row gap-2 md:gap-0 items-center md:items-start justify-between">
        <div className="flex flex-col gap-1 items-start">
          <div className="animate-pulse pl-6 bg-gray-300 text-transparent rounded">
            Minggu, 09 September 2009 09:09 WIB
          </div>
        </div>
        <div className="animate-pulse w-[160px] h-9 md:h-10 bg-gray-300 rounded-full" />
      </div>
    </div>
  );
}
