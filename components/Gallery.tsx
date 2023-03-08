import { type VNode } from "preact";
import { slug } from "../helpers/string-helpers.ts";

interface GalleryProps {
  name: string;
}

const PROP_DEFAULTS: Omit<GalleryProps, "name"> = {};

export default function Gallery(props: GalleryProps) {
  props = { ...PROP_DEFAULTS, ...props };
  const id = `gallery-${slug(props.name)}`;
  const classes = [ "gallery" ];
  const images: VNode[] = [];
  return (
    <figure id={id} class={classes.join(" ")}>
      {images}
      <figcaption>gallery-{slug(props.name)}</figcaption>
    </figure>
  );
}
