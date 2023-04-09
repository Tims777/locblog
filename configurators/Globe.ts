import { type Directive } from "preactify-markdown/types.d.ts";
import { type GlobeProps } from "../islands/Globe.tsx";
import { type GeoObject, type Rotation } from "../types.d.ts";
import db from "../services/database.ts";

export default async function configure(
  directive: Directive,
): Promise<GlobeProps | false> {
  if (directive.type == "textDirective") {
    return false;
  }

  const visits = await db.place_overview.query({
    orderBy: "last_visit asc",
  });
  const flights = await db.flight_overview.query({
    orderBy: "date asc",
  });
  const features = [
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
  const first = visits[0];
  const initialRotation: Rotation = [-first.longitude, 0];
  return { features, initialRotation };
}
