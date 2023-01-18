import { Head } from "$fresh/runtime.ts";
import Globe from "../components/Globe.tsx";
import Pin from "../components/Pin.tsx";
import { GeoLocation, GeoObject, Rotation } from "../types.d.ts";
import * as world from "../static/world.json" assert { type: "json" };
import { Handlers, PageProps } from "$fresh/server.ts";
import db from "../data/database.ts";

export const handler: Handlers<GeoLocation> = {
  async GET(req, ctx) {
    const locations = await db.location.query(1, { orderBy: "id desc"});
    return ctx.render([locations[0].longitude, locations[0].latitude]);
  },
};

export default function HomePage(props: PageProps<GeoLocation>) {
  const rotation: Rotation = [-props.data[0], 0];
  return (
    <>
      <Head>
        <title>LocBlog</title>
        <link rel="stylesheet" href="/style.css" />
      </Head>
      <a href="/map">
        <svg
          class="globe"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="-250 -250 500 500"
        >
          <Globe
            rotation={rotation}
            features={world.default.features as GeoObject[]}
          />
          <Pin rotation={rotation} location={props.data} />
        </svg>
      </a>
    </>
  );
}
