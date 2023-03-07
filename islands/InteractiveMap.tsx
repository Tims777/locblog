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
import Cluster from "ol/source/Cluster";
import { useGeographic } from "ol/proj";
import { Icon, Style } from "ol/style";
import { GeoLocation } from "../types.d.ts";
import PlaceDetails from "../islands/PlaceDetails.tsx";
import { renderToElement } from "../helpers/preact-helpers.ts";
import PopupContainer from "../components/PopupContainer.tsx";
import { Place } from "../schema/place.ts";
import { type MaybeSerialized } from "../helpers/serialization-helpers.ts";

export interface InteractiveMapProps {
  center?: GeoLocation;
  features?: MaybeSerialized<Place[]>;
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

function loadFeatures(places: MaybeSerialized<Place[]>) {
  return places.map((place) =>
    new Feature({
      ...place,
      geometry: new Point([place.longitude, place.latitude]),
    })
  );
}

function loadLayers(features: Feature<Point>[], style: Style) {
  const vectorSource = new VectorSource({ features });
  const clusterSource = new Cluster({
    source: vectorSource,
    distance: 10,
    minDistance: 5,
  });
  const tileSource = new OSM(); // new Stamen({layer: "terrain-background"})
  return [
    new TileLayer({ source: tileSource }),
    new VectorLayer({ source: clusterSource, style }),
  ];
}

function loadStyle() {
  return new Style({
    image: new Icon({
      src: "/pin.svg",
      anchor: [0, 1],
      scale: 30,
    }),
  });
}

function createMap(target: HTMLElement, props: InteractiveMapProps) {
  const p = { ...PROP_DEFAULTS, ...props };
  useGeographic();
  const style = loadStyle();
  const features = loadFeatures(p.features);
  const layers = loadLayers(features, style);
  const view = new View({
    center: props.center,
    zoom: 7,
  });

  const selectedStyle = style.clone();
  selectedStyle.getImage().setRotation(-0.1);

  const select = new Select({ style: selectedStyle });

  const locationDetailsOverlay = new Overlay({ autoPan: true });
  const overlays = [locationDetailsOverlay];

  select.on("select", (event) => {
    const selected = event.selected as Feature[];
    if (selected.length) {
      const all = selected.flatMap(s => s.getProperties().features as Feature[]).map(f => f.getProperties());
      const element = renderToElement(
        <PopupContainer>
          <PlaceDetails places={all as MaybeSerialized<Place>[]} />
        </PopupContainer>,
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
