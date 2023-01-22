import Map from "ol/Map";
import View from "ol/View";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import OSM from "ol/source/OSM";
import VectorSource from "ol/source/Vector";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import { Icon, Style } from "ol/style";
import { useGeographic } from "ol/proj";
import { GeoLocation, GeoLocationDto } from "../types.d.ts";

export interface InteractiveMapProps {
  center?: GeoLocation;
  features?: GeoLocationDto[];
  focus?: boolean;
}

const PROP_DEFAULTS: Required<InteractiveMapProps> = {
  center: [0, 0],
  features: [],
  focus: false,
};

export default function InteractiveMap(props: InteractiveMapProps) {
  return <div class="map" tabIndex={0} ref={(div) => createMap(div!, props)} />;
}

function loadFeatures(locations: GeoLocationDto[]) {
  const result = locations.map((loc) =>
    new Feature({
      geometry: new Point([loc.longitude, loc.latitude]),
    })
  );
  const style = new Style({
    image: new Icon({
      src: "/pin.svg",
      anchor: [0, 1],
      scale: 0.1,
    }),
  });
  result.forEach((r) => r.setStyle(style));
  return result;
}

function createMap(target: HTMLElement, props: InteractiveMapProps) {
  const p = { ...PROP_DEFAULTS, ...props };
  console.log(props, p);
  useGeographic();
  const vectorSource = new VectorSource({
    features: loadFeatures(p.features),
  });
  const map = new Map({
    target: target,
    layers: [
      new TileLayer({
        source: new OSM(),
      }),
      //new TileLayer({
      //  source: new Stamen({layer: "terrain-background"}),
      //}),
      new VectorLayer({
        source: vectorSource,
      }),
    ],
    view: new View({
      center: props.center,
      zoom: 7,
    }),
  });

  if (props.focus) {
    target.focus();
  }
}
