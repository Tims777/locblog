import { select as d3Select, geoPath, geoOrthographic } from "d3";
import { useState, useEffect, useRef } from "preact/hooks";
import { Rotation, GeoObject, Translation } from "../types.d.ts";

export interface GlobeProps {
  initialRotation?: Rotation;
  rotationSpeed?: Rotation;
  translation?: Translation;
  features?: GeoObject[];
}

const PROP_DEFAULTS: GlobeProps = {
  initialRotation: [0, 0],
  rotationSpeed: [0, 0],
  translation: [0, 0],
  features: [],
}

interface StaticGlobeProps {
  rotation?: Rotation;
  translation?: Translation;
  features?: GeoObject[];
}

export default function Globe(props: GlobeProps) {
  props = {...PROP_DEFAULTS, ...props};

  const [rotation, setRotation] = useState<Rotation>(props.initialRotation!);
  const ref = useRef<SVGGElement>(null);

  useEffect(() => {
    const handle = requestAnimationFrame((time) => {
      updateGlobe(ref.current!, { ...props, rotation });
      setRotation(r => [
        props.initialRotation![0] + props.rotationSpeed![0] * time / 1000,
        props.initialRotation![1] + props.rotationSpeed![1] * time / 1000,
      ]);
    });
    return () => cancelAnimationFrame(handle);
  }, [rotation]);

  return (
    <g ref={ref} />
  );
}

function updateGlobe(target: SVGSVGElement | SVGGElement, props: StaticGlobeProps) {
  const projection = geoOrthographic().translate(props.translation!).rotate(props.rotation!);
  const path = geoPath(projection).pointRadius(d => (d as any).properties?.radius ?? 1);
  const globe = d3Select(target);
  globe
    .selectAll("path")
    .data(props.features!)
    .join("path")
    .attr("d", path)
    .attr("fill", d => (d as any).properties?.fill ?? "black");
}
