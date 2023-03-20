import { StateUpdater, useEffect, useState } from "preact/hooks";
import { type VNode } from "preact";
import { slug } from "../helpers/string-helpers.ts";
import { GalleryRow } from "../components/GalleryRow.tsx";
import { type Gallery } from "../schema/gallery.ts";
import { type Media, MediaType } from "../schema/media.ts";

type GalleryContent = VNode;
export const galleryId = (name: string) => `gallery-${slug(name)}`;
export const galleryUrl = (name: string) => `/api/gallery/${slug(name)}`;
export const galleryClass = "gallery";
export const unsupportedMediaTypeClass = "unsupported-media";

interface GalleryProps {
  children: string[];
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

function asNode(media: Media): GalleryContent {
  switch (media.type) {
    case MediaType.image:
      return <img src={media.preview ?? media.resource} />;
  }
  console.warn(`Media type ${media.type} is not currently supported.`);
  return <div class={unsupportedMediaTypeClass} />;
}

async function fetchGallery(name: string) {
  console.debug(`Loading gallery ${name}`);
  const url = galleryUrl(name);
  const response = await fetch(url);
  if (response.ok) {
    const json = await response.json() as Gallery;
    return json.content.map(asNode);
  } else {
    console.error(`Gallery ${name} could not be loaded.`);
    return null;
  }
}

async function lazyLoadGallery(
  props: GalleryProps,
  setContent: StateUpdater<GalleryContent[][]>,
) {
  props = { ...PROP_DEFAULTS, ...props };
  const pattern = getColumnCountPattern(props.columns!);
  setContent([[<>Loading...</>]]);
  let content: GalleryContent[] = [];
  for (const galleryName of props.children) {
    const result = await fetchGallery(galleryName);
    if (result) content = [...content, ...result];
  }
  setContent(distribute(content, pattern));
}

export default function Gallery(props: GalleryProps) {
  const [content, setContent] = useState<GalleryContent[][]>([]);
  useEffect(() => {
    lazyLoadGallery(props, setContent);
  }, [props]);
  return (
    <figure class={galleryClass}>
      {content.map(asChildren).map(GalleryRow)}
    </figure>
  );
}
