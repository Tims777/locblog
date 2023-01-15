import Map from "ol/Map";
import View from "ol/View";
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Stamen from "ol/source/Stamen";
import VectorSource from "ol/source/Vector";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import { Icon, Style } from "ol/style";
import { useGeographic } from "ol/proj";
import { GeoLocation } from "../types.ts";
import { Head } from "$fresh/runtime.ts";

interface InteractiveMapProps {
  center: GeoLocation;
}

export default function InteractiveMap(props: InteractiveMapProps) {
  return (
  <>
    <Head>
      <link rel="stylesheet" href="/map.css" />
    </Head>
    <div class="interactive map" ref={div => createMap(div!, props)} />
  </>);
}

function createMap(target: HTMLElement, props: InteractiveMapProps) {
  useGeographic();
  const style = new Style({
    image: new Icon({
      src: "/pin.svg",
      anchor: [0, 1],
      scale: 0.1,
    })
  });
  const iconFeature = new Feature({
    geometry: new Point(props.center)
  });
  const vectorSource = new VectorSource({
    features: [iconFeature],
  });
  iconFeature.setStyle(style);
  const map = new Map({
    target: target,
    layers: [
      new TileLayer({
        source: new Stamen({
          layer: "terrain",
        }),
      }),
      new VectorLayer({
        source: vectorSource,
      })
    ],
    view: new View({
      center: props.center,
      zoom: 8,
    }),
  });
}
