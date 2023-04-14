import MarkdownPreactifier from "preactify-markdown/mod.ts";
import FullScreen from "../components/FullScreen.tsx";
import Gallery from "../islands/Gallery.tsx";
import configureGallery from "../configurators/Gallery.ts";
import Map from "../islands/Map.tsx";
import configureMap from "../configurators/Map.ts";
import Globe from "../islands/Globe.tsx";
import configureGlobe from "../configurators/Globe.ts";
import DocumentOverview from "../components/DocumentOverview.tsx";
import configureDocumentOverview from "../configurators/DocumentOverview.ts";

const config = {
  fullscreen: { component: FullScreen },
  documents: {
    component: DocumentOverview,
    configure: configureDocumentOverview,
  },
  gallery: { component: Gallery, configure: configureGallery },
  map: { component: Map, configure: configureMap },
  globe: { component: Globe, configure: configureGlobe },
};

const md = new MarkdownPreactifier(config);
export default md;
