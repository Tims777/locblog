import { geoOrthographic, geoPath, select as d3Select } from "d3";
import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import { GeoObject, Rotation, Translation } from "../types.d.ts";
import { default as world } from "../static/world.json" assert { type: "json" };

const background = {
  type: "Sphere",
  properties: { fill: "lightgray" },
};

export interface GlobeProps {
  features?: GeoObject[];
  initialRotation?: Rotation;
  translation?: Translation;
  rotationSpeed?: Rotation;
}

const PROP_DEFAULTS: Required<GlobeProps> = {
  features: [],
  initialRotation: [0, 0],
  translation: [0, 0],
  rotationSpeed: [10, 0],
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
  const offset = useMemo(() => performance.now(), []);
  const staticGlobeProps: StaticGlobeProps = { ...p, rotation };

  if (p.rotationSpeed) {
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

  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-250 -250 500 500"
      class="w-full h-full"
    >
      <g ref={ref}>{createGlobe(staticGlobeProps)}</g>
    </svg>
  );
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
  const allFeatures = [
    background,
    ...world.features,
    ...props.features,
  ] as GeoObject[];
  return allFeatures.map((feature) => {
    return (
      <path
        d={path(feature) ?? undefined}
        {...feature.properties}
      />
    );
  });
}

function setCustomPropeties(
  this: SVGPathElement | d3.BaseType,
  data: GeoObject,
) {
  if (!data.properties) return;
  const target = d3Select(this);
  for (const [k, v] of Object.entries(data.properties)) {
    target.attr(k, v);
  }
}

function updateGlobe(
  target: SVGSVGElement | SVGGElement,
  props: StaticGlobeProps,
) {
  const path = createPathGenerator(props.rotation, props.translation);
  const allFeatures = [
    background,
    ...world.features,
    ...props.features,
  ] as GeoObject[];
  const globe = d3Select(target);
  globe
    .selectAll("path")
    .data(allFeatures)
    .join("path")
    .attr("d", path)
    .each(setCustomPropeties);
}
