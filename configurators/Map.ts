import { type Directive } from "preactify-markdown/types.d.ts";
import { type MapProps } from "../islands/Map.tsx";
import db from "../services/database.ts";

export default async function configure(
  directive: Directive,
): Promise<MapProps | false> {
  const features = await db.place_overview.query({
    orderBy: "last_visit asc",
  });
  const props = { features, ...directive.attributes };
  const last = features.at(features.length - 1);
  if (last) {
    return { center: [last.longitude, last.latitude], ...props };
  } else {
    return props;
  }
}
