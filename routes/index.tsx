import { Head } from "$fresh/runtime.ts";
import Globe from "../components/Globe.tsx";
import Pin from "../components/Pin.tsx";
import { GeoLocation, GeoObject, Rotation } from "../types.ts";
import * as world from "../static/world.json" assert { type: "json" };
import { Pool } from "postgres";

const dbString = Deno.env.get("DATABASE")!;
const pool = new Pool(dbString, 3);

async function queryLocations(limit = 100): Promise<GeoLocation[]> {
  const client = await pool.connect();
  const result = await client.queryArray<GeoLocation>(
    `select longitude, latitude from location order by id limit ${limit}`,
  );
  return result.rows;
}

const location: GeoLocation = (await queryLocations())[0];
const rotation: Rotation = [-location[0], 0];

export default function Home() {
  return (
    <>
      <Head>
        <title>LocBlog</title>
        <link rel="stylesheet" href="/style.css" />
      </Head>
      <a href="/map" style="display: block">
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
          <Pin rotation={rotation} location={location} />
        </svg>
      </a>
    </>
  );
}
