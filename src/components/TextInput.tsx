import {
  TextInput as FlowbiteTextInput,
  type TextInputProps as FlowbiteTextInputProps,
} from "flowbite-react";
import { forwardRef, type FocusEvent } from "react";

export type TextInputProps = FlowbiteTextInputProps & {
  autoSelect?: boolean;
};

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  function TextInput({ autoSelect, onFocus, ...props }, ref) {
    const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
      onFocus?.(event);
      if (event.defaultPrevented) return;
      if (autoSelect) event.target.select();
    };

    return <FlowbiteTextInput ref={ref} {...props} onFocus={handleFocus} />;
  },
);
