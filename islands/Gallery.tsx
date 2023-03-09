import { StateUpdater, useEffect, useState } from "preact/hooks";
import { type VNode } from "preact";
import { slug } from "../helpers/string-helpers.ts";
import { GalleryRow } from "../components/GalleryRow.tsx";

export const galleryId = (name: string) => `gallery-${slug(name)}`;
export const galleryClass = "gallery";

type GalleryImage = VNode;

interface GalleryProps {
  name?: string;
  children?: VNode | VNode[];
  columns?: string | number | number[];
}

const PROP_DEFAULTS: Omit<GalleryProps, "name"> = {
  children: [],
  columns: 3,
};

function makeArray<T>(target: T | T[]): T[] {
  return Array.isArray(target) ? target : [target];
}

function asChildren<T>(x: T) {
  return { children: x };
}

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

function lazyLoadGallery(
  props: GalleryProps,
  setImages: StateUpdater<GalleryImage[][]>,
) {
  if (!props.name) return;
  props = { ...PROP_DEFAULTS, ...props };
  console.log("Loading gallery", props.name);
  setImages([[<>"Loading..."</>]]);
  const images = Array.from(Array(31).keys()).map((x) => <div>{x}</div>);
  const pattern = getColumnCountPattern(props.columns!);
  setImages(distribute(images, pattern));
}

export default function Gallery(props: GalleryProps) {
  const [images, setImages] = useState<GalleryImage[][]>([]);
  useEffect(() => {
    lazyLoadGallery(props, setImages);
  }, [props]);
  return (
    <figure class={galleryClass}>
      {images.map(asChildren).map(GalleryRow)}
    </figure>
  );
}
