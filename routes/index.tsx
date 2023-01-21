import { Head } from "$fresh/runtime.ts";
import Globe from "../islands/Globe.tsx";
import { GeoLocation, GeoObject, Rotation } from "../types.d.ts";
import * as world from "../static/world.json" assert { type: "json" };
import { Handlers, PageProps } from "$fresh/server.ts";
import db from "../services/database.ts";

interface GlobePageData {
  location: GeoLocation;
  features: GeoObject[];
}

export const handler: Handlers<GlobePageData> = {
  async GET(req, ctx) {
    const locations = await db.location.query(1, { orderBy: "id desc"});
    const location = [locations[0].longitude, locations[0].latitude] as GeoLocation;
    const features = [...world.default.features, { type: 'Point', coordinates: location, properties: { fill: "red" } }] as GeoObject[];
    return ctx.render({ location, features });
  },
};

export default function GlobePage(props: PageProps<GlobePageData>) {
  const rotation: Rotation = [-props.data.location[0], 0];
  return (
    <>
      <Head>
        <title>LocBlog</title>
        <link rel="stylesheet" href="/style.css" />
      </Head>
      <a href="/map">
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width={1000} height={500}>
          <Globe
            initialRotation={rotation}
            rotationSpeed={[10, 0]}
            features={props.data.features}
          />
        </svg>
      </a>
    </>
  );
}
