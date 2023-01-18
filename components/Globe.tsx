import { geoOrthographic, geoPath } from "d3";
import { GeoObject, Rotation, Translation } from "../types.d.ts";

interface GlobeProps {
  rotation?: Rotation;
  translation?: Translation;
  features?: GeoObject[];
}

const PROP_DEFAULTS: GlobeProps = {
  rotation: [0, 0],
  translation: [0, 0],
  features: [],
};

export default function Globe(props: GlobeProps) {
  const paths = createGlobe(props);
  return (
    <g>
      {paths}
    </g>
  );
}

function createGlobe(props: GlobeProps) {
  props = { ...PROP_DEFAULTS, ...props };
  const projection = geoOrthographic()
    .translate(props.translation!)
    .rotate(props.rotation!);
  const path = geoPath(projection);
  return props.features!.map((feature) => {
    const d = path(feature);
    return d ? <path d={d} /> : <></>;
  });
}
