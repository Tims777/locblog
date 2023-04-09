import { type Directive } from "preactify-markdown/types.d.ts";
import { type GalleryProps } from "../islands/Gallery.tsx";

export default function configure(directive: Directive): GalleryProps | false {
  if (directive.type == "textDirective") {
    return false;
  }

  // TODO: Load gallery content here
  return directive.attributes as GalleryProps;
}
