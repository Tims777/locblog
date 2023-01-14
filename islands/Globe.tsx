import { select as d3Select, geoPath, geoOrthographic } from "d3";
import { GeoRotation, GeoObject } from "../types.ts";

interface GlobeProps {
  rotation?: GeoRotation;
  features?: GeoObject[];
}

export default function Globe(props: GlobeProps) {
  return (
    <g ref={g => createGlobe(g!, props)} />
  );
}

function createGlobe(target: SVGSVGElement | SVGGElement, props: GlobeProps) {
  const projection = geoOrthographic().rotate(props.rotation ?? [0, 0]);
  const path = geoPath().projection(projection);
  const globe = d3Select(target);
  globe
    .selectAll("path")
    .data(props.features ?? [])
    .join("path")
    .attr("d", path);
}
