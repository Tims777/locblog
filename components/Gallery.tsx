import { useMemo } from "preact/hooks";
import type { ComponentChildren } from "preact";
import GalleryRow from "../components/GalleryRow.tsx";
import type { Gallery } from "../schema/gallery.ts";
import { asChildren, makeArray } from "../helpers/preact-helpers.ts";
import { galleryContentClass } from "../components/GalleryContent.tsx";
import LightBox from "../islands/LightBox.tsx";

export const galleryClass = "gallery";

export interface GalleryProps {
  children?: ComponentChildren;
  columns?: string | number | number[];
}

const PROP_DEFAULTS: Required<GalleryProps> = {
  children: [],
  columns: 3,
};

function getColumnCountPattern(arg: string | number | number[]): number[] {
  if (typeof arg === "string") {
    return arg.split(/[ ,]/).map((x) => parseInt(x));
  } else {
    return makeArray(arg);
  }
}

function distribute<T>(targets: T[], pattern: number[]) {
  const result = [] as T[][];
  let index = 0;
  pattern = pattern.filter(isFinite);
  while (pattern.length) {
    for (let size of pattern) {
      if (index >= targets.length) return result;
      if (size <= 0) size = 1;
      result.push(targets.slice(index, index + size));
      index += size;
    }
  }
  throw new Error("Cannot distribute among invalid pattern!");
}

export default function Gallery(props: GalleryProps) {
  props = { ...PROP_DEFAULTS, ...props };

  const rows = useMemo(
    () => {
      const pattern = getColumnCountPattern(props.columns!);
      return distribute(makeArray(props.children), pattern)
        .map(asChildren)
        .map(GalleryRow);
    },
    [props.children],
  );

  return (
    <>
      <figure class={[galleryClass, "not-prose", "m-2"].join(" ")}>
        {rows}
      </figure>
      <LightBox
        gallerySelector="body"
        contentSelector={`.${galleryContentClass}`}
      />
    </>
  );
}
