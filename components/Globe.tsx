import { geoPath, geoOrthographic } from "d3";
import { GeoRotation, GeoObject } from "../types.ts";

interface GlobeProps {
  rotation?: GeoRotation;
  features?: GeoObject[];
}

export default function Globe(props: GlobeProps) {
  const paths = createGlobe(props)
  return (
    <g>
      {paths}
    </g>
  );
}

function createGlobe(props: GlobeProps) {
  const projection = geoOrthographic().rotate(props.rotation ?? [0, 0]);
  const path = geoPath().projection(projection);
  return props.features?.map(feature => {
    const d = path(feature);
    return d ? (<path d={d}/>) : <></>;
  });
}
