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

export function GalleryContent(props: Media) {
  let caption, content;
  switch (props.type) {
    case "image":
      content = (
        <img class={contentClasses} src={props.preview ?? props.resource} />
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
