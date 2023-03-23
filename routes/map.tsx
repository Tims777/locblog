import { Head } from "$fresh/runtime.ts";
import InteractiveMap, {
  InteractiveMapProps,
} from "../islands/InteractiveMap.tsx";
import db from "../services/database.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { GeoLocation } from "../types.d.ts";

export const handler: Handlers<InteractiveMapProps> = {
  async GET(_, ctx) {
    const places = await db.place_overview.query({
      orderBy: "last_visit asc",
    });
    const last = places[places.length - 1];
    const center: GeoLocation = [last.longitude, last.latitude];
    return ctx.render({ center, features: places, focus: true });
  },
};

export default function MapPage(props: PageProps<InteractiveMapProps>) {
  return (
    <>
      <Head>
        <title>LocBlog</title>
        <link rel="stylesheet" href="https://esm.sh/ol@7.3.0/ol.css" />
      </Head>
      <main class="w-screen h-screen">
        <InteractiveMap {...props.data} />
      </main>
    </>
  );
}
