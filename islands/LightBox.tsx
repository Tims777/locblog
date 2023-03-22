import { useEffect, useRef } from "preact/hooks";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import { type SlideData, type UIElementData } from "photoswipe";
import GalleryCaption from "../components/GalleryCaption.tsx";
import { renderToString } from "preact-render-to-string";

const captionPlugin = {
  name: "caption",
  appendTo: "wrapper",
  onInit: (el, pswp) => {
    pswp.on("change", () => {
      const current = pswp.currSlide?.data.element;
      const captions = current?.parentElement?.getElementsByTagName(
        "figcaption",
      );
      el.innerHTML = captions?.length
        ? renderToString(
          <GalleryCaption size="lg">{captions[0].textContent}</GalleryCaption>,
        )
        : "";
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
  lightbox.init();
  return lightbox;
}

interface LightBoxProps {
  gallerySelector: string;
  contentSelector: string;
}

export default function LightBox(props: LightBoxProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const lightbox = initialize(
      ref.current!,
      props,
    );
    return () => lightbox.destroy();
  }, []);
  return <div ref={ref} class="lightbox" />;
}
