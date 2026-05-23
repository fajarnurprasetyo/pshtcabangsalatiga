import {
  type TextareaProps as FlowbiteTextareaProps,
  Textarea as FlowbiteTextarea,
} from "flowbite-react";
import { forwardRef } from "react";

export type TextareaProps = FlowbiteTextareaProps & {
  autoSelect?: boolean;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ autoSelect, onFocus, ...props }, ref) {
    const handleFocus: React.FocusEventHandler<HTMLTextAreaElement> = (
      event,
    ) => {
      onFocus?.(event);
      if (event.defaultPrevented) return;
      if (autoSelect) event.target.select();
    };

    return <FlowbiteTextarea ref={ref} {...props} onFocus={handleFocus} />;
  },
);
