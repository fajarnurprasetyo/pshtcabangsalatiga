/* eslint-disable @typescript-eslint/no-explicit-any */

import { twMerge } from "tailwind-merge";

export function PostContent(props: Record<string, any>) {
  switch (props._type) {
    case "block":
      return (
        <p>
          {props.children?.map((child: Record<string, any>) => (
            <PostContent key={child._key} {...props} {...child} />
          ))}
        </p>
      );
    case "span": {
      const marks = props.markDefs?.filter((mark: Record<string, any>) =>
        props.marks?.includes(mark._key),
      );

      const span = (
        <span
          className={
            props.marks &&
            twMerge([
              props.marks.includes("strong") && "font-semibold",
              props.marks.includes("em") && "italic",
            ])
          }
        >
          {props.text || "\u00A0"}
        </span>
      );

      switch (marks?.[0]?._type) {
        case "link":
          return (
            <a
              href={marks[0].href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-700 underline"
            >
              {span}
            </a>
          );
        default:
          return span;
      }
    }
    default:
      console.error("Unknown content type:", props._type);
      return null;
  }
}
