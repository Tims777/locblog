import { type Directive } from "preactify-markdown/types.d.ts";
import { type GlobeProps } from "../islands/Globe.tsx";
import { type GeoObject } from "../types.d.ts";
import { default as world } from "../static/world.json" with { type: "json" };
import db from "../services/database.ts";

export default async function configure(
  directive: Directive,
): Promise<GlobeProps | false> {
  const visits = await db.place_overview.query({
    orderBy: "last_visit asc",
  });
  const flights = await db.flight_overview.query({
    orderBy: "date asc",
  });
  const features = [
    ...world.features,
    ...visits.map((v) => ({
      type: "Point",
      coordinates: [v.longitude, v.latitude],
      properties: { fill: "red", radius: 1.5 },
    })),
    ...flights.map((f) => ({
      type: "LineString",
      coordinates: [[f.from.longitude, f.from.latitude], [
        f.to.longitude,
        f.to.latitude,
      ]],
      properties: {
        fill: "transparent",
        stroke: "orange",
        "stroke-linecap": "round",
      },
    })),
  ] as GeoObject[];
  const props = { features, ...directive.attributes };
  const first = visits.at(0);
  if (first) {
    return { initialRotation: [-first.longitude, 0], ...props };
  } else {
    return props;
  }
}
