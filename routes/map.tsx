import { Head } from "$fresh/runtime.ts";
import InteractiveMap from "../islands/InteractiveMap.tsx";
import db from "../services/database.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { GeoLocation } from "../types.d.ts";

export const handler: Handlers<GeoLocation> = {
  async GET(req, ctx) {
    const locations = await db.location.query(1, { orderBy: "id desc"});
    return ctx.render([locations[0].longitude, locations[0].latitude]);
  },
};

export default function MapPage(props: PageProps<GeoLocation>) {
  return (
    <>
      <Head>
        <title>LocBlog</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ol/ol.css" />
        <link rel="stylesheet" href="/style.css" />
      </Head>
      <InteractiveMap center={props.data} />
    </>
  );
}
