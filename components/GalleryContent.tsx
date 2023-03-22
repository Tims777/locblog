import { type Media } from "../schema/media.ts";

const contentClasses = [
  "w-full",
  "peer",
].join(" ");

const captionClasses = [
  "absolute",
  "bottom-0",
  "w-full",
  "overflow-scroll",
  "leading-4",
  "max-h-16",
  "peer-hover:translate-y-16",
  "duration-500",
  "text-sm",
  "text-white",
  "p-1",
  "bg-gradient-to-t",
  "from-black",
].join(" ");

function updatePhotoSwipeSizes(event: { currentTarget: HTMLImageElement }) {
  const img = event.currentTarget;
  const parent = img.parentElement;
  const maxZoom = 2;
  const width = window.screen.width * maxZoom;
  const ratio = img.height / img.width;
  const height = width * ratio;
  parent?.setAttribute("data-pswp-width", width.toFixed(0));
  parent?.setAttribute("data-pswp-height", height.toFixed(0));
}

export function GalleryContent(props: Media & { class: string }) {
  let caption, content;
  switch (props.type) {
    case "image":
      content = (
        <a
          class={[props.class, contentClasses].join(" ")}
          href={props.resource}
        >
          <img
            class="w-full"
            src={props.preview ?? props.resource}
            alt={props.alt}
            title={props.title}
            onLoad={updatePhotoSwipeSizes}
          />
        </a>
      );
      if (props.description) {
        caption = (
          <caption class={captionClasses}>
            {props.description}
          </caption>
        );
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
