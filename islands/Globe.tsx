import { geoOrthographic, geoPath, select as d3Select } from "d3";
import { useEffect, useRef, useState } from "preact/hooks";
import { GeoObject, Rotation, Translation } from "../types.d.ts";

export interface GlobeProps {
  features?: GeoObject[];
  initialRotation?: Rotation;
  translation?: Translation;
  rotationSpeed?: Rotation | null;
}

const PROP_DEFAULTS: Required<GlobeProps> = {
  features: [],
  initialRotation: [0, 0],
  translation: [0, 0],
  rotationSpeed: null,
};

interface StaticGlobeProps {
  features: GeoObject[];
  rotation: Rotation;
  translation: Translation;
}

export default function Globe(props: Partial<GlobeProps>) {
  const p = { ...PROP_DEFAULTS, ...props };
  const ref = useRef<SVGGElement>(null);
  const [rotation, setRotation] = useState<Rotation>(p.initialRotation);
  const staticGlobeProps: StaticGlobeProps = { ...p, rotation };

  if (p.rotationSpeed) {
    const [offset, setOffset] = useState(performance.now());
    useEffect(() => {
      const handle = requestAnimationFrame((time) => {
        const correctedTime = (time - offset) / 1000;
        updateGlobe(ref.current!, staticGlobeProps);
        setRotation(() => [
          p.initialRotation[0] + p.rotationSpeed![0] * correctedTime,
          p.initialRotation[1] + p.rotationSpeed![1] * correctedTime,
        ]);
      });
      return () => cancelAnimationFrame(handle);
    }, [staticGlobeProps]);
  }

  return <g ref={ref}>{createGlobe(staticGlobeProps)}</g>;
}

function createPathGenerator(rotation: Rotation, translation: Translation) {
  const projection = geoOrthographic()
    .rotate(rotation)
    .translate(translation);
  return geoPath<GeoObject>(projection)
    .pointRadius((p) => getProperty<number>(p, "radius") ?? 1);
}

function getProperty<T = unknown>(obj: GeoObject, name: string): T | null {
  return obj.properties ? obj.properties[name] : null;
}

function createGlobe(props: StaticGlobeProps) {
  const path = createPathGenerator(props.rotation, props.translation);
  return props.features.map((feature) => {
    return (
      <path
        d={path(feature) ?? undefined}
        fill={getProperty(feature, "fill") ?? undefined}
      />
    );
  });
}

function updateGlobe(
  target: SVGSVGElement | SVGGElement,
  props: StaticGlobeProps,
) {
  const path = createPathGenerator(props.rotation, props.translation);
  const globe = d3Select(target);
  globe
    .selectAll("path")
    .data(props.features)
    .join("path")
    .attr("d", path)
    .attr("fill", (d) => getProperty(d, "fill") ?? "black");
}
