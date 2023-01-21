import { select as d3Select, geoPath, geoOrthographic } from "d3";
import { useState, useEffect, useRef } from "preact/hooks";
import { Rotation, GeoObject } from "../types.d.ts";

export interface GlobeProps {
  initialRotation?: Rotation;
  rotationSpeed?: Rotation;
  features?: GeoObject[];
}

const PROP_DEFAULTS: GlobeProps = {
  initialRotation: [0, 0],
  rotationSpeed: [0, 0],
  features: [],
}

export default function Globe(props: GlobeProps) {
  props = {...PROP_DEFAULTS, ...props};

  const [rotation, setRotation] = useState<Rotation>(props.initialRotation!);
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

function updateGlobe(target: SVGSVGElement | SVGGElement, rotation: Rotation, features: GeoObject[]) {
  const projection = geoOrthographic().rotate(rotation);
  const path = geoPath(projection);
  const globe = d3Select(target);
  globe
    .selectAll("path")
    .data(features)
    .join("path")
    .attr("d", path)
    .attr("fill", d => (d as any).properties?.fill ?? "black");
}
