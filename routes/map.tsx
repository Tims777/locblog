import { Head } from "$fresh/runtime.ts";
import InteractiveMap, {
  InteractiveMapProps,
} from "../islands/InteractiveMap.tsx";
import db from "../services/database.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { GeoLocation } from "../types.d.ts";
import { serialize } from "../helpers/serialization-helpers.ts";

export const handler: Handlers<InteractiveMapProps> = {
  async GET(req, ctx) {
    const locations = await db.location.query({ orderBy: "last_visit desc" });
    const center: GeoLocation = [locations[0].longitude, locations[0].latitude];
    return ctx.render({ center, features: serialize(locations), focus: true });
  },
};

export default function MapPage(props: PageProps<InteractiveMapProps>) {
  return (
    <>
      <Head>
        <title>LocBlog</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ol/ol.css" />
        <link rel="stylesheet" href="/style.css" />
      </Head>
      <InteractiveMap {...props.data} />
    </>
  );
}
