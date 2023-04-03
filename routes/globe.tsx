import { Head } from "$fresh/runtime.ts";
import Globe, { GlobeProps } from "../islands/Globe.tsx";
import { GeoObject, Rotation } from "../types.d.ts";
import { default as world } from "../static/world.json" assert { type: "json" };
import { Handlers, PageProps } from "$fresh/server.ts";
import db from "../services/database.ts";

export const handler: Handlers<GlobeProps> = {
  async GET(_, ctx) {
    const visits = await db.place_overview.query({
      orderBy: "last_visit asc",
    });
    const flights = await db.flight_overview.query({
      orderBy: "date asc",
    });
    const features = [
      {
        type: "Sphere",
        properties: { fill: "lightgray" },
      },
      ...world.features,
      ...visits.map((v) => ({
        type: "Point",
        coordinates: [v.longitude, v.latitude],
        properties: { fill: "red", radius: 1.5 },
      })),
      ...flights.map((f) => ({
        type: "LineString",
        coordinates: [[f.from.longitude, f.from.latitude], [f.to.longitude, f.to.latitude]],
        properties: { fill: "transparent", stroke: "orange", "stroke-linecap": "round" },
      })),
    ] as GeoObject[];
    const first = visits[0];
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
      </Head>
      <a href="/map">
        <svg
          class="w-screen h-screen"
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
