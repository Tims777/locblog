import { type Directive } from "preactify-markdown/types.d.ts";
import { type MapProps } from "../islands/Map.tsx";
import { type GeoLocation } from "../types.d.ts";
import db from "../services/database.ts";

export default async function configure(
  directive: Directive,
): Promise<MapProps | false> {
  if (directive.type == "textDirective") {
    return false;
  }

  const features = await db.place_overview.query({
    orderBy: "last_visit asc",
  });
  const last = features[features.length - 1];
  const center: GeoLocation = [last.longitude, last.latitude];
  return { center, features };
}
