import Map from "ol/Map";
import View from "ol/View";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import OSM from "ol/source/OSM";
import VectorSource from "ol/source/Vector";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import Select, { type SelectEvent } from "ol/interaction/Select";
import Overlay from "ol/Overlay";
import Cluster from "ol/source/Cluster";
import Style from "ol/style/Style";
import Icon from "ol/style/Icon";
import { useGeographic } from "ol/proj";
import { GeoLocation } from "../types.d.ts";
import PlaceDetails from "../islands/PlaceDetails.tsx";
import { renderToElement } from "../helpers/preact-helpers.ts";
import PopupContainer from "../components/PopupContainer.tsx";
import { Place } from "../schema/place.ts";
import { type MaybeSerialized } from "../helpers/serialization-helpers.ts";
import { getCenter } from "../helpers/ol-helpers.ts";

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
      geometry: new Point([place.longitude, place.latitude], "XY"),
    })
  );
}

function loadLayers(features: Feature[], style: Style) {
  const vectorSource = new VectorSource({ features });
  const clusterSource = new Cluster({
    source: vectorSource,
    distance: 10,
    minDistance: 5,
  });
  const tileSource = new OSM({}); // new Stamen({layer: "terrain-background"})
  return [
    new TileLayer({
      source: tileSource,
      preload: Infinity,
    }),
    new VectorLayer({
      source: clusterSource,
      style,
      updateWhileInteracting: true,
      updateWhileAnimating: true,
    }),
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

  select.on("select", (event: SelectEvent) => {
    const selected = event.selected;
    if (selected.length) {
      const all = selected.flatMap((x: Feature) =>
        (x.getProperties() as { features: Feature[] }).features
      );
      const places = all.map((x: Feature) =>
        x.getProperties() as MaybeSerialized<Place>
      );
      const element = renderToElement(
        <PopupContainer>
          <PlaceDetails places={places} />
        </PopupContainer>,
      );
      locationDetailsOverlay.setElement(element as HTMLElement);
      locationDetailsOverlay.setPosition(getCenter(all));
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
