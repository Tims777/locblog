import { type VNode } from "preact";

export const rowClass = "row";
export const colCountClass = (count: number) => `columns-${count}`;

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
  const classes = [rowClass, colCountClass(childCount)];
  return <div class={classes.join(" ")}>{props.children}</div>;
}
