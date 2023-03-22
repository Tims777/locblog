import { type VNode } from "preact";

interface GalleryRowProps {
  children?: VNode | VNode[];
}

function count(x: unknown | unknown[]): number {
  if (Array.isArray(x)) {
    return x.length;
  } else if (!(typeof x in ["undefined", "null"])) {
    return 1;
  } else {
    return 0;
  }
}

export function GalleryRow(props: GalleryRowProps) {
  const childCount = count(props.children);
  const classes = [
    "grid",
    `grid-cols-${childCount}`,
    "max-sm:grid-cols-1",
    "my-2",
    "gap-2",
    "items-center",
    "[&>*]:w-full"
  ];
  return <div class={classes.join(" ")}>{props.children}</div>;
}
