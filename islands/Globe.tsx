import {
  geoOrthographic,
  geoPath,
  pointer as d3Pointer,
  select as d3Select,
} from "d3";
import type { BaseType } from "d3";
import { useEffect, useRef } from "preact/hooks";
import { GeoObject, Vec2, Vec3 } from "../types.d.ts";

const background = {
  type: "Sphere",
  properties: { fill: "lightgray" },
};
const acceleration = 0.2;
const maxAnimationStep = 0.05;
const minDragDist = 4.0;

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
    if (!globeRef.current) return;
    const globe = globeRef.current;

    let preventClick = false;
    const onDragStart = (event: PointerEvent) => {
      const coords = getCoords(event, rotationRef.current, globe);
      if (!coords) return;
      preventClick = false;
      momentumRef.current = [0, 0, 0];
      dragStateRef.current = {
        c0: coords,
        r0: rotationRef.current,
      };
      globe.style.cursor = "grabbing";
      globe.setPointerCapture(event.pointerId);
      event.preventDefault();
    };
    const onDrag = (event: PointerEvent) => {
      if (!dragStateRef.current) return;
      const drag = dragStateRef.current;
      const coords = getCoords(event, drag.r0, globe);
      if (!coords) return;
      const deltaR = coords.map((_, i) => coords[i] - drag.c0[i]);
      if (Math.hypot(...deltaR) > minDragDist) preventClick = true;
      const newR = [drag.r0[0] + deltaR[0], drag.r0[1], drag.r0[2]] as Vec3;
      rotationRef.current = newR;
      if (globeRef.current) draw(globeRef.current, p.features, newR);
      event.preventDefault();
    };
    const onDragEnd = (event: PointerEvent) => {
      dragStateRef.current = null;
      globe.style.cursor = "";
      event.preventDefault();
    };
    const onClick = (event: PointerEvent) => {
      if (preventClick) {
        event.preventDefault();
        preventClick = false;
        return;
      }
      if (!p.href) return;
      const coords = getCoords(event, rotationRef.current);
      if (!coords) return;
      location.assign(hrefWithPosition(p.href, coords));
    };

    globe.addEventListener("click", onClick);
    globe.addEventListener("pointerdown", onDragStart);
    globe.addEventListener("pointermove", onDrag);
    globe.addEventListener("pointerup", onDragEnd);
    globe.addEventListener("pointercancel", onDragEnd);
    globe.addEventListener("lostpointercapture", onDragEnd);

    return () => {
      globe.removeEventListener("click", onClick);
      globe.removeEventListener("pointerdown", onDragStart);
      globe.removeEventListener("pointermove", onDrag);
      globe.removeEventListener("pointerup", onDragEnd);
      globe.removeEventListener("pointercancel", onDragEnd);
      globe.removeEventListener("lostpointercapture", onDragEnd);
    };
  }, []);

  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-250 -250 500 500"
      class="w-full h-full"
    >
      <g ref={globeRef} class="cursor-grab" />
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
