import { useContext, useEffect, useRef } from "preact/hooks";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import { type SlideData, type UIElementData } from "photoswipe";
import GalleryCaption from "../components/GalleryCaption.tsx";
import { render } from "preact";
import { createContext } from "preact";
import { Head } from "$fresh/runtime.ts";

const LIGHTBOX_CONTEXT = createContext({ initialized: false });

const captionPlugin = {
  name: "caption",
  appendTo: "wrapper",
  onInit: (el, pswp) => {
    pswp.on("change", () => {
      const parent = pswp.currSlide?.data.element?.parentElement;
      const captions = parent?.getElementsByTagName("figcaption");
      if (captions?.length) {
        render(
          <GalleryCaption size="lg">{captions[0].textContent}</GalleryCaption>,
          el,
        );
      }
    });
  },
} as UIElementData;

const itemDataFilter = (
  itemData: SlideData,
  element: HTMLElement,
  linkEl: HTMLAnchorElement,
) => {
  const imgEl = element.firstElementChild;
  if (imgEl instanceof HTMLImageElement) {
    const maxZoom = 2;
    const width = window.screen.width * maxZoom;
    const ratio = imgEl.height / imgEl.width;
    const height = width * ratio;
    itemData.w = width;
    itemData.h = height;
    itemData.msrc = imgEl.src;
  }
  itemData.src = linkEl.href;
  return itemData;
};

function loadStyle() {
  render(
    <link
      rel="stylesheet"
      href="https://esm.sh/photoswipe@5.3.6/dist/photoswipe.css"
    />,
    document.head,
  );
}

function unloadStyle() {
  // TODO
}

function initialize(
  appendToEl: HTMLElement,
  props: LightBoxProps,
) {
  console.debug("Initializing LightBox");
  const lightbox = new PhotoSwipeLightbox({
    appendToEl,
    bgOpacity: 1,
    gallerySelector: props.gallerySelector,
    children: props.contentSelector,
    pswpModule: () => import("photoswipe"),
  });
  lightbox.addFilter("domItemData", itemDataFilter);
  lightbox.on(
    "uiRegister",
    () => lightbox?.pswp?.ui?.registerElement(captionPlugin),
  );
  lightbox.on("init", () => loadStyle());
  lightbox.on("destroy", () => unloadStyle());
  lightbox.init();
  return lightbox;
}

interface LightBoxProps {
  gallerySelector: string;
  contentSelector: string;
}

export default function LightBox(props: LightBoxProps) {
  const context = useContext(LIGHTBOX_CONTEXT);
  if (!context.initialized) {
    useEffect(() => {
      const lightbox = initialize(
        document.body,
        props,
      );
      return () => lightbox.destroy();
    }, []);

    context.initialized = true;
  }
  return <script />;
}
