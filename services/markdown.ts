import Gallery from "../islands/Gallery.tsx";
import configureGallery from "../configurators/Gallery.ts";
import Map from "../islands/Map.tsx";
import configureMap from "../configurators/Map.ts";
import Globe from "../islands/Globe.tsx";
import configureGlobe from "../configurators/Globe.ts";
import MarkdownPreactifier from "preactify-markdown/mod.ts";

const config = {
  gallery: { component: Gallery, configure: configureGallery },
  map: { component: Map, configure: configureMap },
  globe: { component: Globe, configure: configureGlobe },
};

const md = new MarkdownPreactifier(config);
export default md;
