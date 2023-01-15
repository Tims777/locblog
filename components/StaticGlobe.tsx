import { geoPath, geoOrthographic } from "d3";
import { GeoRotation, GeoObject } from "../types.ts";

interface StaticGlobeProps {
  rotation?: GeoRotation;
  features?: GeoObject[];
}

const DEFAULT_PROPS: StaticGlobeProps = {
  rotation: [0, 0],
  features: [],
}

export default function StaticGlobe(props: StaticGlobeProps) {
  props = {...DEFAULT_PROPS, ...props};
  const paths = createGlobe(props)
  return (
    <g>
      {paths}
    </g>
  );
}

function createGlobe(props: StaticGlobeProps) {
  const projection = geoOrthographic().rotate(props.rotation!);
  const path = geoPath().projection(projection);
  return props.features?.map(feature => {
    const d = path(feature);
    return d ? (<path d={d}/>) : <></>;
  });
}
