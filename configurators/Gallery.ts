import { type Directive } from "preactify-markdown/types.d.ts";
import { type GalleryProps } from "../components/Gallery.tsx";
import { slug } from "../helpers/string-helpers.ts";
import db from "../services/database.ts";
import GalleryContent from "../components/GalleryContent.tsx";
import { Media, MediaType } from "../schema/media.ts";
import type { Link } from "https://esm.sh/v117/mdast-util-from-markdown@1.3.0/lib/index.d.ts";

export const galleryUrl = (name: string) => `/api/gallery/${slug(name)}`;

function isLink(node: { type: string }): node is Link {
  return node.type == "link";
}

function notNull<T>(x: T | null): x is T {
  return x !== null;
}

export default async function configure(
  directive: Directive,
): Promise<GalleryProps | false> {
  if (directive.type == "containerDirective") {
    // The gallery content is already given in directive.children
    const children = directive.children
      .map((node) => "children" in node ? node.children : [])
      .flat()
      .filter(isLink)
      .map(asGalleryContent);
    return { children };
  } else {
    // The gallery content needs to be loaded from the database
    const galleries = directive.children
      .map((node) => "value" in node ? loadGallery(node.value) : null);
    const children = (await Promise.all(galleries))
      .filter(notNull)
      .flatMap((gal) => gal.content)
      .map(GalleryContent);
    return { children };
  }
}

function asGalleryContent(directive: Link) {
  const media: Partial<Media> = {
    resource: directive.url,
    description: directive.title ?? undefined,
  };
  const child = directive.children.length ? directive.children[0] : null;
  if (child?.type == "image") {
    media.type = MediaType.image;
    media.preview = child.url;
    media.description ??= child.title ?? undefined;
    media.alt = child.alt ?? undefined;
  }
  return GalleryContent(media as Media);
}

async function loadGallery(name: string) {
  const gallery = await db.gallery.query({
    where: { name },
    limit: 1,
  });
  return gallery.length ? gallery[0] : null;
}
