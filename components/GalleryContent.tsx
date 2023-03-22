import { type Media } from "../schema/media.ts";
import GalleryCaption from "./GalleryCaption.tsx";

function updatePhotoSwipeData(event: { currentTarget: HTMLImageElement }) {
  const img = event.currentTarget;
  const parent = img.parentElement;
  const maxZoom = 2;
  const width = window.screen.width * maxZoom;
  const ratio = img.height / img.width;
  const height = width * ratio;
  parent?.setAttribute("data-pswp-width", width.toFixed(0));
  parent?.setAttribute("data-pswp-height", height.toFixed(0));
}

export default function GalleryContent(props: Media & { class: string }) {
  let caption, content;
  switch (props.type) {
    case "image":
      content = (
        <a
          class={[props.class, "w-full", "peer/content"].join(" ")}
          href={props.resource}
          data-pswp-description={props.description}
        >
          <img
            class="w-full"
            src={props.preview ?? props.resource}
            alt={props.alt}
            title={props.title}
            onLoad={updatePhotoSwipeData}
          />
        </a>
      );
      if (props.description) {
        caption = <GalleryCaption>{props.description}</GalleryCaption>
      }
      break;
    default:
      console.warn(`Media type ${props.type} is not currently supported.`);
  }
  return (
    <figure class="relative overflow-hidden">
      {content}
      {caption}
    </figure>
  );
}
