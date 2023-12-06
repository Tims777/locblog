import OlMap from "ol/Map";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import OSM from "ol/source/OSM";
import StadiaMaps from "ol/source/StadiaMaps";
import XYZ from "ol/source/XYZ";
import VectorSource from "ol/source/Vector";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import Select, { type SelectEvent } from "ol/interaction/Select";
import Overlay from "ol/Overlay";
import Cluster from "ol/source/Cluster";
import Style from "ol/style/Style";
import Icon from "ol/style/Icon";
import { Control, defaults as defaultControls } from "ol/control";
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

class ReturnToStartPage extends Control {
  constructor() {
    const returnHome = () => window.location.href = "/";

    const element = renderToElement(
      <div class="ol-unselectable ol-control top-16 left-2">
        <button title="Start page" onClick={returnHome}>🏠</button>
      </div>,
    ) as HTMLElement;

    super({
      element: element,
    });
  }
}

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
  return [
    /*new TileLayer({
      source: new StadiaMaps({layer: "stamen_terrain_background", retina: true }),
    }),
    new TileLayer({
      source: new StadiaMaps({layer: "stamen_terrain_lines", retina: true }),
    }),*/
    new TileLayer({
      source: new XYZ({ url: "https://tiles-eu.stadiamaps.com/data/satellite/{z}/{x}/{y}.jpg", maxZoom: 20 })
    }),
    new TileLayer({
      source: new StadiaMaps({layer: "stamen_terrain_labels", retina: true }),
    }),
    /*new VectorLayer({
      source: clusterSource,
      style,
      updateWhileInteracting: true,
      updateWhileAnimating: true,
    }),*/
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

function loadControls() {
  return defaultControls().extend([new ReturnToStartPage()]);
}

function updatePermalink(event: MapEvent) {
  const view = event.map.getView();
  const center = view.getCenter() ?? [undefined, undefined];
  const state = {
    lat: center[1]?.toFixed(3),
    lon: center[0]?.toFixed(3),
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
    center = [params.get("lon")!, params.get("lat")!].map(
      parseFloat,
    ) as GeoLocation;
  }
  let zoom = defaultZoom;
  if (params.has("zoom")) {
    zoom = parseFloat(params.get("zoom")!);
  }
  return Promise.resolve({
    minZoom,
    maxZoom,
    center,
    zoom,
  });
}

function createMap(target: HTMLElement, props: MapProps) {
  useGeographic();
  const p = { ...PROP_DEFAULTS, ...props };
  const style = loadStyle();
  const controls = loadControls();
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
    controls,
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
