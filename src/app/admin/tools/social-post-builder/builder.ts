"use client";

import background from "@/images/social-post-builder/background.png";
import brandDark from "@/images/social-post-builder/brand-dark.png";
import brandLight from "@/images/social-post-builder/brand-light.png";
import hashtagDark from "@/images/social-post-builder/hashtag-dark.png";
import hashtagLight from "@/images/social-post-builder/hashtag-light.png";
import logo from "@/images/social-post-builder/logo.png";
import social from "@/images/social-post-builder/social.png";
import {
  Canvas,
  FabricImage,
  filters,
  Group,
  Point,
  Shadow,
  type BasicTransformEvent,
  type FabricObject,
  type TPointerEvent,
} from "fabric";
import type { RefObject } from "react";
import { useEffect, useReducer, useRef, useState } from "react";
import { useBoolean } from "react-use";

export interface BuilderOptions {
  width: number;
  height: number;
  dark: boolean;
}

export function useBuilder(
  canvasEl: RefObject<HTMLCanvasElement | null>,
  options: BuilderOptions,
) {
  const canvasRef = useRef<Canvas>(null);
  const [version, update] = useReducer(() => Date.now(), 0);

  const [ready, setReady] = useBoolean(false);
  const [imgBg, setImgBg] = useState<FabricImage | null>(null);
  // const [imgLogo, setImgLogo] = useState<FabricImage | null>(null);
  const [imgBrandDark, setImgBrandDark] = useState<FabricImage | null>(null);
  const [imgBrandLight, setImgBrandLight] = useState<FabricImage | null>(null);
  const [imgTagDark, setImgTagDark] = useState<FabricImage | null>(null);
  const [imgTagLight, setImgTagLight] = useState<FabricImage | null>(null);
  const [groupOverlay, setGroupOverlay] = useState<Group | null>(null);

  const handleObjectMoving = ({
    target,
  }: BasicTransformEvent<TPointerEvent> & {
    target: FabricObject;
  }) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const canvasCenterX = canvas.getWidth() / 2;
    const canvasCenterY = canvas.getHeight() / 2;

    const center = target.getCenterPoint();

    let x = center.x;
    let y = center.y;

    if (Math.abs(center.x - canvasCenterX) < 18) {
      x = canvasCenterX;
    }

    if (Math.abs(center.y - canvasCenterY) < 18) {
      y = canvasCenterY;
    }

    target.setPositionByOrigin(new Point(x, y), "center", "center");
  };

  useEffect(() => {
    if (!canvasEl.current) return;

    let cancel = false;

    const canvas = new Canvas(canvasEl.current, {
      width: options.width,
      height: options.height,
    });

    (async () => {
      const imgBg = await FabricImage.fromURL(background.src);
      const imgLogo = await FabricImage.fromURL(logo.src);
      const imgBrandDark = await FabricImage.fromURL(brandDark.src);
      const imgBrandLight = await FabricImage.fromURL(brandLight.src);
      const imgTagDark = await FabricImage.fromURL(hashtagDark.src);
      const imgTagLight = await FabricImage.fromURL(hashtagLight.src);
      const imgSocial = await FabricImage.fromURL(social.src);

      if (!cancel) {
        imgBg.set({
          name: "Background",
          left: 0,
          top: 0,
          originX: "left",
          originY: "top",
          selectable: false,
          evented: false,
        });
        setImgBg(imgBg);
        canvas.add(imgBg);

        imgLogo.set({
          left: 96,
          top: 69,
          selectable: false,
          evented: false,
        });

        imgLogo.on("modified", update);
        // canvas.add(imgLogo);
        // setImgLogo(imgLogo);

        imgBrandDark.set({
          left: 228,
          top: 69,
          selectable: false,
          evented: false,
        });
        // canvas.add(imgBrandDark);
        setImgBrandDark(imgBrandDark);

        imgBrandLight.set({
          left: 228,
          top: 69,
          selectable: false,
          evented: false,
        });
        // canvas.add(imgBrandLight);
        setImgBrandLight(imgBrandLight);

        imgTagDark.set({
          left: 910,
          top: 69,
          selectable: false,
          evented: false,
        });
        // canvas.add(imgTagDark);
        setImgTagDark(imgTagDark);

        imgTagLight.set({
          left: 910,
          top: 69,
          selectable: false,
          evented: false,
        });
        // canvas.add(imgTagLight);
        setImgTagLight(imgTagLight);

        imgSocial.set({
          left: 540,
          top: 1290,
          selectable: false,
          evented: false,
          shadow: new Shadow({
            color: "#00000044",
            blur: 4,
            offsetX: 3,
            offsetY: 3,
          }),
        });

        // canvas.add(imgSocial);

        const groupOverlay = new Group(
          [
            imgLogo,
            imgBrandDark,
            imgBrandLight,
            imgTagDark,
            imgTagLight,
            imgSocial,
          ],
          {
            name: "Overlay",
            selectable: false,
            evented: false,
          } as any,
        );

        groupOverlay.on("modified", update);
        canvas.add(groupOverlay);
        setGroupOverlay(groupOverlay);

        canvas.on("object:moving", handleObjectMoving);

        canvas.on("selection:created", update);
        canvas.on("selection:updated", update);
        canvas.on("selection:cleared", update);

        canvasRef.current = canvas;
        setReady(true);
      }
    })();

    return () => {
      cancel = true;
      canvas.dispose();
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.backgroundColor = options.dark ? "#000000" : "#ffffff";

      if (imgBg) {
        // imgBg.opacity = options.bgOpacity / 100;
        imgBg.filters = options.dark ? [new filters.Invert()] : [];
        imgBg.applyFilters();
      }

      if (imgBrandDark) imgBrandDark.visible = options.dark;
      if (imgBrandLight) imgBrandLight.visible = !options.dark;
      if (imgTagDark) imgTagDark.visible = options.dark;
      if (imgTagLight) imgTagLight.visible = !options.dark;

      canvas.requestRenderAll();
    }
  }, [options]);

  return {
    ready,
    version,
    objects: canvasRef.current?.getObjects() ?? [],
    activeObject: canvasRef.current?.getActiveObject(),
    activeObjects: canvasRef.current?.getActiveObjects() ?? [],
    addObject(obj: FabricObject) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const cw = canvas.getWidth();
      const ch = canvas.getHeight();

      const scale = Math.min(cw / obj.width, ch / obj.height);

      obj.set({
        left: cw / 2,
        top: ch / 2,
        originX: "center",
        originY: "center",
        scaleX: scale,
        scaleY: scale,
      });

      canvas.add(obj);

      if (groupOverlay) {
        canvas.bringObjectToFront(groupOverlay);
      }
    },
    updateObject(obj: FabricObject, state: Record<string, any>) {
      if (!canvasRef.current) return;

      obj.set(state);
      canvasRef.current.fire("object:modified");
      canvasRef.current.requestRenderAll();
    },
  };
}
