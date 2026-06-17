import MarkdownPreactifier from "preactify-markdown/mod.ts";
import Gallery from "../components/Gallery.tsx";
import configureGallery from "../configurators/Gallery.ts";
import Map from "../islands/Map.tsx";
import configureMap from "../configurators/Map.ts";
import Globe from "../islands/Globe.tsx";
import configureGlobe from "../configurators/Globe.ts";
import DocumentOverview from "../components/DocumentOverview.tsx";
import configureDocumentOverview from "../configurators/DocumentOverview.ts";
import Navigation from "../islands/Navigation.tsx";
import configureDocumentMetadata from "../configurators/DocumentMetadata.ts";
import configureDocumentComments from "../configurators/DocumentComments.ts";
import configureIcon from "../configurators/Icon.ts";
import type { ConfiguratorContext } from "../types.d.ts";
import type { DirectiveOptions } from "preactify-markdown/types.d.ts";

const config = {
  div: { component: "div" },
  icon: { component: "span", configure: configureIcon },
  meta: { component: "span", configure: configureDocumentMetadata },
  comments: { component: "div", configure: configureDocumentComments },
  navigation: { component: Navigation },
  documents: {
    component: DocumentOverview,
    configure: configureDocumentOverview,
  },
  gallery: { component: Gallery, configure: configureGallery },
  map: { component: Map, configure: configureMap },
  globe: { component: Globe, configure: configureGlobe },
} as const;

const md = new MarkdownPreactifier<ConfiguratorContext>(config as DirectiveOptions);
export default md;
