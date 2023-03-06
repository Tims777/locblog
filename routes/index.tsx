import { Head } from "$fresh/runtime.ts";
import Globe, { GlobeProps } from "../islands/Globe.tsx";
import { GeoObject, Rotation } from "../types.d.ts";
import * as world from "../static/world.json" assert { type: "json" };
import { Handlers, PageProps } from "$fresh/server.ts";
import db from "../services/database.ts";

export const handler: Handlers<GlobeProps> = {
  async GET(req, ctx) {
    const locations = await db.location.query({ orderBy: "last_visit desc" });
    const features = [
      {
        type: "Sphere",
        properties: { fill: "lightgray" },
      },
      ...world.default.features,
      ...locations.map((l) => ({
        type: "Point",
        coordinates: [l.longitude, l.latitude],
        properties: { fill: "red", radius: 1.5 },
      })),
    ] as GeoObject[];
    const initialRotation: Rotation = [-locations[0].longitude, 0];
    const rotationSpeed: Rotation = [10, 0];
    return ctx.render({ features, initialRotation, rotationSpeed });
  },
};

export default function GlobePage(props: PageProps<GlobeProps>) {
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
          <Globe {...props.data} />
        </svg>
      </a>
    </>
  );
}
