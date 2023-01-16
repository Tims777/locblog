import { Head } from "$fresh/runtime.ts";
import { GeoLocation } from "../types.ts";
import { Pool } from "postgres";
import InteractiveMap from "../islands/InteractiveMap.tsx";

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

export default function Home() {
  return (
    <>
      <Head>
        <title>LocBlog</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ol/ol.css" />
        <link rel="stylesheet" href="/style.css" />
      </Head>
      <InteractiveMap center={location} />
    </>
  );
}
