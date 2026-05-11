"use client";

import { FabricImage } from "fabric";
import { useRef, type JSX } from "react";
import { CgSpinner } from "react-icons/cg";
import type { IconType } from "react-icons/lib";
import {
  MdCheck,
  MdClose,
  MdDownload,
  MdImage,
  MdTextFields
} from "react-icons/md";
import { useBoolean } from "react-use";
import { twMerge } from "tailwind-merge";
import { useBuilder } from "./builder";
import "./style.css";

type ToolbarButtonProps = JSX.IntrinsicElements["button"] & {
  icon: IconType;
};

function ToolbarButton({
  icon: Icon,
  className,
  ...props
}: ToolbarButtonProps) {
  return (
    <button
      {...props}
      className={twMerge("p-3 text-xl sm:text-2xl md:text-3xl", className)}
    >
      {<Icon />}
    </button>
  );
}

function ToolbarDivider({ className, ...props }: JSX.IntrinsicElements["hr"]) {
  return (
    <hr
      {...props}
      className={twMerge("my-2 border-white/50 border-l h-auto", className)}
    />
  );
}

export default function SocialPostBuilderPage() {
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const inputImageEl = useRef<HTMLInputElement>(null);

  const [dark, toggleDark] = useBoolean(false);

  const builder = useBuilder(canvasEl, {
    width: 1080,
    height: 1350,
    dark,
  });

  return (
    <div className="flex flex-col bg-gray-950 w-dvw h-dvh text-white">
      <div className="flex justify-end">
        {builder.activeObject ? (
          <>
            <ToolbarButton icon={MdCheck} />
            <ToolbarDivider />
            <ToolbarButton icon={MdClose} />
          </>
        ) : (
          <ToolbarButton icon={MdDownload} />
        )}
      </div>
      <div className="relative flex flex-1 justify-center items-center">
        <div
          className={twMerge(
            "absolute inset-0 m-auto max-w-full max-h-full aspect-4/5",
            "[&>.canvas-container]:absolute!",
            "[&>.canvas-container]:w-full!",
            "[&>.canvas-container]:h-full!",
            "[&>.canvas-container>canvas]:absolute!",
            "[&>.canvas-container>canvas]:w-full!",
            "[&>.canvas-container>canvas]:h-full!",
          )}
        >
          <canvas ref={canvasEl} />
        </div>
        {!builder.ready && (
          <CgSpinner size="34" className="absolute animate-spin" />
        )}
      </div>

      <div className="flex">
        <ToolbarButton icon={MdTextFields} />
        <ToolbarDivider />
        <input
          hidden
          ref={inputImageEl}
          type="file"
          accept="image/*"
          onChange={async ({ target }) => {
            const file = target.files?.[0];
            if (!file) return;
            const url = URL.createObjectURL(file);
            const image = await FabricImage.fromURL(url);
            builder.addObject(image);
          }}
        />
        <ToolbarButton
          icon={MdImage}
          onClick={() => inputImageEl.current?.click()}
        />
      </div>
    </div>
  );
}
