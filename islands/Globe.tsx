import { select as d3Select, geoPath, geoOrthographic } from "d3";
import { useState, useEffect, useRef } from "preact/hooks";
import { GeoRotation, GeoObject } from "../types.ts";

export interface GlobeProps {
  initialRotation?: GeoRotation;
  rotationSpeed?: GeoRotation;
  features?: GeoObject[];
}

const DEFAULT_PROPS: GlobeProps = {
  initialRotation: [0, 0],
  rotationSpeed: [0, 0],
  features: [],
}

export default function Globe(props: GlobeProps) {
  props = {...DEFAULT_PROPS, ...props};

  const [rotation, setRotation] = useState<GeoRotation>(props.initialRotation!);
  const ref = useRef<SVGGElement>(null);

  useEffect(() => {
    const handle = requestAnimationFrame((time) => {
      updateGlobe(ref.current!, rotation, props.features ?? []);
      setRotation(r => [
        props.rotationSpeed![0] * time / 1000,
        props.rotationSpeed![1] * time / 1000,
      ]);
    });
    return () => cancelAnimationFrame(handle);
  }, [rotation]);

  return (
    <g ref={ref} />
  );
}

function updateGlobe(target: SVGSVGElement | SVGGElement, rotation: GeoRotation, features: GeoObject[]) {
  const projection = geoOrthographic().rotate(rotation);
  const path = geoPath().projection(projection);
  const globe = d3Select(target);
  globe
    .selectAll("path")
    .data(features)
    .join("path")
    .attr("d", path);
}
