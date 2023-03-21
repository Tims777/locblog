import { Head } from "$fresh/runtime.ts";
import Globe, { GlobeProps } from "../islands/Globe.tsx";
import { GeoObject, Rotation } from "../types.d.ts";
import { default as world } from "../static/world.json" assert { type: "json" };
import { Handlers, PageProps } from "$fresh/server.ts";
import db from "../services/database.ts";

export const handler: Handlers<GlobeProps> = {
  async GET(_, ctx) {
    const places = await db.place_overview.query({
      orderBy: "last_visit asc",
    });
    const features = [
      {
        type: "Sphere",
        properties: { fill: "lightgray" },
      },
      ...world.features,
      ...places.map((l) => ({
        type: "Point",
        coordinates: [l.longitude, l.latitude],
        properties: { fill: "red", radius: 1.5 },
      })),
    ] as GeoObject[];
    const first = places[0];
    const initialRotation: Rotation = [-first.longitude, 0];
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
          class="w-full h-full"
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
