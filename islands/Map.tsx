import OlMap from "ol/Map";
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
import type MapEvent from "ol/MapEvent";
import { useGeographic } from "ol/proj";
import { Head } from "$fresh/runtime.ts";
import { GeoLocation } from "../types.d.ts";
import PlaceDetails from "../islands/PlaceDetails.tsx";
import { renderToElement } from "../helpers/preact-helpers.ts";
import PopupContainer from "../components/PopupContainer.tsx";
import { type PlaceDetails as Place } from "../schema/place.ts";
import { type MaybeSerialized } from "../helpers/serialization-helpers.ts";
import { getCenter } from "../helpers/ol-helpers.ts";

const minZoom = 2;
const maxZoom = 20;

export interface MapProps {
  center?: GeoLocation;
  zoom?: number;
  features?: MaybeSerialized<Place[]>;
  focus?: boolean;
  permalink?: boolean;
}

const PROP_DEFAULTS: Required<MapProps> = {
  center: [0, 0],
  zoom: 7,
  features: [],
  focus: true,
  permalink: true,
};

export default function Map(props: MapProps) {
  return (
    <>
      <Head>
        <link rel="stylesheet" href="https://esm.sh/ol@7.3.0/ol.css" />
      </Head>
      <div
        class="w-full h-full"
        tabIndex={0}
        ref={(div) => createMap(div!, props)}
      />
    </>
  );
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

function updatePermalink(event: MapEvent) {
  const view = event.map.getView();
  const center = view.getCenter() ?? [undefined, undefined];
  const state = {
    lat: center[0]?.toFixed(3),
    lon: center[1]?.toFixed(3),
    zoom: view.getZoom()?.toFixed(0),
  };
  const url = new URL(window.location.href);
  for (const [k, v] of Object.entries(state)) {
    if (v) url.searchParams.set(k, v);
  }
  window.history.replaceState(state, "", url);
}

function loadView(defaultCenter: GeoLocation, defaultZoom: number) {
  const params = new URL(window.location.href).searchParams;
  let center = defaultCenter;
  if (params.has("lat") && params.has("lon")) {
    center = [params.get("lat")!, params.get("lon")!].map(
      parseFloat,
    ) as GeoLocation;
  }
  let zoom = defaultZoom;
  if (params.has("zoom")) {
    zoom = parseFloat(params.get("zoom")!);
  }
  return new View({
    minZoom,
    maxZoom,
    center,
    zoom,
  });
}

function createMap(target: HTMLElement, props: MapProps) {
  const p = { ...PROP_DEFAULTS, ...props };
  useGeographic();
  const style = loadStyle();
  const features = loadFeatures(p.features);
  const layers = loadLayers(features, style);
  const view = loadView(p.center, p.zoom);

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

  const map = new OlMap({
    target,
    layers,
    view,
    overlays,
  });

  map.addInteraction(select);

  if (p.permalink) {
    map.on("moveend", updatePermalink);
  }

  if (p.focus) {
    target.focus();
  }

  features.forEach((f) => {
    f.setStyle(style);
  });
}
