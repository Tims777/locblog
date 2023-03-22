import { StateUpdater, useEffect, useMemo, useState } from "preact/hooks";
import { type ComponentChild, ComponentChildren, type VNode } from "preact";
import { slug } from "../helpers/string-helpers.ts";
import GalleryRow from "../components/GalleryRow.tsx";
import { type Gallery } from "../schema/gallery.ts";
import { type Media } from "../schema/media.ts";
import GalleryContent from "../components/GalleryContent.tsx";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import { Head } from "$fresh/runtime.ts";
import { type UIElementData } from "photoswipe";
import { renderToString } from "preact-render-to-string";
import GalleryCaption from "../components/GalleryCaption.tsx";
import { revive } from "../helpers/preact-helpers.ts";

export const galleryId = (name: string) => `gallery-${slug(name)}`;
export const galleryUrl = (name: string) => `/api/gallery/${slug(name)}`;
export const galleryClass = "gallery";
export const galleryContentClass = "gallery-content";

interface GalleryProps {
  children: ComponentChildren;
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

function asNode(media: Media): VNode {
  return <GalleryContent class={galleryContentClass} {...media} />;
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

async function lazyLoadGalleryContent(
  galleryNames: string[],
  setContent: StateUpdater<VNode[]>,
) {
  setContent([<>Loading...</>]);
  let content: VNode[] = [];
  for (const name of galleryNames) {
    const result = await fetchGallery(name);
    if (result) content = [...content, ...result];
  }
  setContent(content);
}

function initializeLightBox() {
  const lightbox = new PhotoSwipeLightbox({
    gallerySelector: `.${galleryClass}`,
    children: `.${galleryContentClass}`,
    pswpModule: () => import("photoswipe"),
  });
  lightbox.on(
    "uiRegister",
    () => lightbox.pswp?.ui?.registerElement(captionPlugin),
  );
  lightbox.init();
}

const captionPlugin = {
  name: "caption",
  appendTo: "wrapper",
  onInit: (el, pswp) => {
    pswp.on("change", () => {
      const current = pswp.currSlide?.data.element;
      const description = current?.getAttribute("data-pswp-description");
      const html = renderToString(
        <GalleryCaption size="lg">{description}</GalleryCaption>,
      );
      el.innerHTML = html;
    });
  },
} as UIElementData;

function parseGalleryContent(
  elements: ComponentChild[],
): { eager: unknown[]; lazy: string[] } {
  const eager = [];
  const lazy = [];
  for (const el of elements) {
    if (!el) {
      continue;
    } else if (typeof el === "string") {
      const galleryName = el.trim();
      if (galleryName) lazy.push(galleryName);
    } else if (
      typeof el === "object" && "props" in el && "children" in el.props
    ) {
      eager.push(...makeArray(el.props.children));
    }
  }
  return { eager, lazy };
}

function defined(x: unknown) {
  return !!x;
}

export default function Gallery(props: GalleryProps) {
  props = { ...PROP_DEFAULTS, ...props };
  const { eager, lazy } = useMemo(
    () => parseGalleryContent(makeArray(props.children)),
    [props.children],
  );
  const eagerContent = useMemo(
    () => eager.map(revive).filter(defined) as VNode[],
    [eager],
  );
  const [lazyContent, setLazyContent] = useState<VNode[]>([]);
  const rows = useMemo(
    () => {
      const pattern = getColumnCountPattern(props.columns!);
      return distribute([...eagerContent, ...lazyContent], pattern)
        .map(asChildren)
        .map(GalleryRow);
    },
    [eagerContent, lazyContent],
  );
  useEffect(() => {
    lazyLoadGalleryContent(lazy, setLazyContent).then(initializeLightBox);
  }, [lazy]);
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://esm.sh/photoswipe@5.3.6/dist/photoswipe.css"
        />
      </Head>
      <figure class={[galleryClass, "not-prose"].join(" ")}>
        {rows}
      </figure>
    </>
  );
}
