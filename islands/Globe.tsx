import {
  drag as d3Drag,
  geoOrthographic,
  geoPath,
  pointer as d3Pointer,
  select as d3Select,
  svg,
} from "d3";
import type { BaseType } from "d3";
import { useEffect, useRef } from "preact/hooks";
import { GeoObject, Vec2, Vec3 } from "../types.d.ts";

const background = {
  type: "Sphere",
  properties: { fill: "lightgray" },
};
const acceleration = 1;
const maxAnimationStep = 0.05;

export interface GlobeProps {
  features?: GeoObject[];
  href?: string;
  initialRotation?: Vec3;
  targetMomentum?: Vec3;
}

const PROP_DEFAULTS: Required<GlobeProps> = {
  features: [],
  href: "",
  initialRotation: [0, 0, 0],
  targetMomentum: [10, 0, 0],
};

interface DragState {
  c0: Vec2;
  r0: Vec3;
}

export default function Globe(props: Partial<GlobeProps>) {
  const p = { ...PROP_DEFAULTS, ...props };
  const svgRef = useRef<SVGSVGElement>(null);
  const globeRef = useRef<SVGGElement>(null);
  const dragStateRef = useRef<DragState>(null);
  const momentumRef = useRef<Vec3>([0, 0, 0]);
  const rotationRef = useRef<Vec3>(p.initialRotation);

  useEffect(() => {
    if (globeRef.current) {
      draw(globeRef.current, p.features, rotationRef.current);
    }
  }, [p.features, p.href, p.targetMomentum]);

  // Automatic Globe Rotation
  useEffect(() => {
    let previousTime = performance.now();
    let handle = requestAnimationFrame(function tick(time) {
      const dt = Math.min(
        (time - previousTime) / 1000,
        maxAnimationStep,
      );
      previousTime = time;

      if (globeRef.current && !dragStateRef.current) {
        const dv = 1 - Math.exp(-acceleration * dt);
        momentumRef.current = momentumRef.current.map(
          (v, i) => v + (p.targetMomentum[i] - v) * dv,
        ) as Vec3;
        rotationRef.current = rotationRef.current.map(
          (r, i) => r + momentumRef.current[i] * dt,
        ) as Vec3;
        draw(globeRef.current, p.features, rotationRef.current);
      }

      handle = requestAnimationFrame(tick);
    });

    return () => cancelAnimationFrame(handle);
  }, []);

  // Globe Dragging
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = svgRef.current;

    const onDragStart = (event: MouseEvent) => {
      const coords = getCoords(event, rotationRef.current, svg);
      if (!coords) return;
      momentumRef.current = [0, 0, 0];
      dragStateRef.current = {
        c0: coords,
        r0: rotationRef.current,
      };
      svg.style.cursor = "grabbing";
    };
    const onDrag = (event: MouseEvent) => {
      if (!dragStateRef.current) return;
      const drag = dragStateRef.current;
      const coords = getCoords(event, drag.r0, svg);
      if (!coords) return;
      const deltaR = [coords[0] - drag.c0[0], 0, 0];
      const newR = drag.r0.map((r0, i) => r0 + deltaR[i]) as Vec3;
      rotationRef.current = newR;
      if (globeRef.current) draw(globeRef.current, p.features, newR);
    };
    const onDragEnd = (_event: MouseEvent) => {
      dragStateRef.current = null;
      svg.style.cursor = "grab";
    };
    const onClick = (event: MouseEvent) => {
      if (!p.href) return;
      const coords = getCoords(event, rotationRef.current);
      if (!coords) return;
      location.assign(hrefWithPosition(p.href, coords));
    };

    svg.addEventListener("click", onClick, true);
    const dragBehavior = d3Drag<SVGSVGElement, unknown>()
      .on("start", (e) => onDragStart(e.sourceEvent))
      .on("drag", (e) => onDrag(e.sourceEvent))
      .on("end", (e) => onDragEnd(e.sourceEvent));
    d3Select(svg).call(dragBehavior);

    return () => {
      svg.removeEventListener("click", onClick, true);
      d3Select(svg).on("drag", null);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-250 -250 500 500"
      class="w-full h-full cursor-grab"
    >
      <g ref={globeRef} />
    </svg>
  );
}

function projection(rotation: Vec3) {
  return geoOrthographic().rotate(rotation).translate([0, 0]);
}

function draw(target: SVGGElement, features: GeoObject[], rotation: Vec3) {
  const path = geoPath<GeoObject>(projection(rotation))
    .pointRadius((d) => d.properties?.radius ?? 1);
  d3Select(target).selectAll("path")
    .data([background, ...features] as GeoObject[])
    .join("path")
    .attr("d", path)
    .each(function (this: SVGPathElement | BaseType, d) {
      for (const [key, value] of Object.entries(d.properties ?? {})) {
        d3Select(this).attr(key, value == null ? null : String(value));
      }
    });
}

function getCoords(
  event: MouseEvent,
  rotation: Vec3,
  target?: HTMLElement | SVGElement,
) {
  const point = d3Pointer(event, target);
  const coords = projection(rotation).invert?.(point);
  return coords?.every(Number.isFinite) ? coords : null;
}

function hrefWithPosition(href: string, [lon, lat]: Vec2): URL {
  const target = new URL(href, location.href);
  target.searchParams.set("lat", Number(lat.toFixed(3)).toString());
  target.searchParams.set("lon", Number(lon.toFixed(3)).toString());
  return target;
}
