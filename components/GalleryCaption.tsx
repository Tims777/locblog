import { type ComponentChildren } from "preact";

const lineCount = 4;

type TextSize = "sm" | "md" | "lg";

const captionClasses = (textSize: string, lineHeight: number) =>
  [
    "absolute",
    "bottom-0",
    "w-full",
    "overflow-scroll",
    `leading-${lineHeight}`,
    `max-h-${lineHeight * lineCount}`,
    "peer-hover/content:translate-y-16",
    "duration-500",
    `text-${textSize}`,
    "text-white",
    `p-${lineHeight / 4}`,
    "bg-black",
    "bg-opacity-50",
    "text-center",
  ].join(" ");

interface GalleryCaptionProps {
  children: ComponentChildren;
  size?: TextSize;
}

export default function GalleryCaption(props: GalleryCaptionProps) {
  const textSize = props.size ?? "sm";
  let lineHeight;
  switch (textSize) {
    case "lg":
      lineHeight = 8;
      break;
    case "md":
      lineHeight = 6;
      break;
    default:
    case "sm":
      lineHeight = 4;
  }
  return (
    <figcaption class={captionClasses(textSize, lineHeight)}>
      {props.children}
    </figcaption>
  );
}
