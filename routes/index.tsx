import { Head } from "$fresh/runtime.ts";
import Globe from "../components/Globe.tsx";
import Pin from "../components/Pin.tsx";
import { GeoLocation, GeoRotation, GeoObject } from "../types.ts";
import * as world from "../static/world.json" assert { type: "json" };
import { Pool } from "postgres";

const dbString = Deno.env.get("DATABASE")!;
const pool = new Pool(dbString, 3);

async function queryLocations(limit = 100): Promise<GeoLocation[]> {
  const client = await pool.connect();
  const result = await client.queryArray<GeoLocation>(`select longitude, latitude from location order by id limit ${limit}`);
  return result.rows;
}

const location: GeoLocation = (await queryLocations())[0];
const rotation: GeoRotation = [-location[0], 0];

export default function Home() {
  return (
    <>
      <Head>
        <title>LocBlog</title>
      </Head>
      <a href="/map">
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width={1000} height={500}>
          <Globe rotation={rotation} features={world.default.features as GeoObject[]} />
          <Pin rotation={rotation} location={location} />
        </svg>
      </a>
    </>
  );
}
