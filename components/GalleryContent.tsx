import { type VNode } from "preact";
import { makeArray } from "../helpers/preact-helpers.ts";
import { type Media } from "../schema/media.ts";
import GalleryCaption from "./GalleryCaption.tsx";

export const galleryContentClass = "gallery-content";

function appendClasses(
  props: Record<string, unknown>,
  ...newClassNames: string[]
) {
  const currentClasses = [];
  if ("class" in props && typeof props.class === "string") {
    currentClasses.push(...props.class.split(" "));
  }
  props.class = [...currentClasses, ...newClassNames].join(" ");
}

function findTitle(node: unknown): string | null {
  if (node && typeof node === "object" && "props" in node) {
    const props = node.props;
    if (props && typeof props === "object") {
      if ("title" in props && typeof props.title === "string") {
        return props.title;
      } else if ("children" in props) {
        for (const child of makeArray(props.children)) {
          const title = findTitle(child);
          if (title) return title;
        }
      }
    }
  }
  return null;
}

export interface CustomGalleryContent {
  type: "custom";
  content: VNode;
}

type GalleryContentProps = Media | CustomGalleryContent;

export default function GalleryContent(props: GalleryContentProps) {
  const contentClasses = [galleryContentClass, "w-full", "peer/content"];
  let caption, content;
  switch (props.type) {
    case "image": {
      content = (
        <a
          class={contentClasses.join(" ")}
          href={props.resource}
          data-pswp-description={props.description}
        >
          <img
            class="w-full h-full object-cover"
            src={props.preview ?? props.resource}
            alt={props.alt}
            title={props.title}
          />
        </a>
      );
      if (props.description) {
        caption = <GalleryCaption>{props.description}</GalleryCaption>;
      }
      break;
    }
    case "custom": {
      content = props.content;
      appendClasses(content.props, ...contentClasses);
      const title = findTitle(content);
      if (title) {
        caption = <GalleryCaption>{title}</GalleryCaption>;
      }
      break;
    }
    default: {
      console.warn(`Media type ${props.type} is not currently supported.`);
      break;
    }
  }
  return (
    <figure class="relative overflow-hidden">
      {content}
      {caption}
    </figure>
  );
}
