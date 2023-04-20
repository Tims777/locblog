import { type Directive } from "preactify-markdown/types.d.ts";
import { type GalleryProps } from "../islands/Gallery.tsx";
import {remove} from "unist-util-remove";

export default function configure(directive: Directive): GalleryProps | false {
  // TODO: Load gallery content here
  remove(directive, (node) => "value" in node && node.value == "\n");
  return directive.attributes as GalleryProps;
}
