import Map from "ol/Map";
import View from "ol/View";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import OSM from "ol/source/OSM";
import VectorSource from "ol/source/Vector";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import Select from "ol/interaction/Select";
import Overlay from "ol/Overlay";
import { useGeographic } from "ol/proj";
import { Icon, Style } from "ol/style";
import { GeoLocation, GeoLocationDto } from "../types.d.ts";
import GeoLocationDetails from "../components/GeoLocationDetails.tsx";
import { renderToElement } from "../helpers/preact-helpers.ts";

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
  return locations.map((loc) =>
    new Feature({
      ...loc,
      geometry: new Point([loc.longitude, loc.latitude]),
    })
  );
}

function loadLayers(features: Feature<any>[]) {
  const vectorSource = new VectorSource({ features });
  const tileSource = new OSM(); // new Stamen({layer: "terrain-background"})
  return [
    new TileLayer({ source: tileSource }),
    new VectorLayer({ source: vectorSource }),
  ];
}

function createMap(target: HTMLElement, props: InteractiveMapProps) {
  const p = { ...PROP_DEFAULTS, ...props };
  useGeographic();
  const features = loadFeatures(p.features);
  const layers = loadLayers(features);
  const view = new View({
    center: props.center,
    zoom: 7,
  });

  const style = new Style({
    image: new Icon({
      src: "/pin.svg",
      anchor: [0, 1],
      scale: 0.1,
    }),
  });

  const selectedStyle = style.clone();
  selectedStyle.getImage().setRotation(-0.1);

  const select = new Select({ style: selectedStyle });

  const locationDetailsOverlay = new Overlay({});
  const overlays = [locationDetailsOverlay];

  select.on("select", (event) => {
    const selected = event.selected as Feature[];
    if (selected.length) {
      const element = renderToElement(
        <GeoLocationDetails
          location={selected[0].getProperties() as GeoLocationDto}
        />
      );
      locationDetailsOverlay.setElement(element as HTMLElement);
      locationDetailsOverlay.setPosition(event.mapBrowserEvent.coordinate);
    } else {
      locationDetailsOverlay.setElement(undefined);
      locationDetailsOverlay.setPosition(undefined);
    }
  });

  const map = new Map({
    target,
    layers,
    view,
    overlays,
  });

  map.addInteraction(select);

  if (props.focus) {
    target.focus();
  }

  features.forEach((f) => {
    f.setStyle(style);
  });
}
