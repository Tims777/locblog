/** @jsx h */
/// <reference no-default-lib="true"/>
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { serve } from "https://deno.land/std@0.171.0/http/server.ts";
import { h, renderSSR } from "https://deno.land/x/nano_jsx@v0.0.36/mod.ts";
import { Pool } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

const HTML_HEADERS = {
  "content-type": "text/html",
};

const dbString = Deno.env.get("DATABASE")!;
const pool = new Pool(dbString, 3);

interface MainPageParams {
  locations?: LocationDto[];
}

function MainPage(params: MainPageParams) {
  const locationList = (params.locations ?? []).map(loc => <li><LocationWidget {...loc} /></li>);
  return (
    <html>
      <head>
        <title>LocBlog</title>
      </head>
      <body>
        <h1>List of Locations</h1>
        <ul>
          {locationList}
        </ul>
      </body>
    </html>
  );
}

function LocationWidget(params: LocationDto) {
  return (
    <p>
      Lat: {params.location.latitude}, Long: {params.location.longitude}
    </p>
  );
}

interface LocationDto {
    location: {
        latitude: number,
        longitude: number,
    },
    description?: string,
}

async function queryLocations() {
  const client = await pool.connect();
  const result = await client.queryObject<LocationDto>("select * from \"Location\"");
  return result.rows;
}

async function requestHandler() {
  const locations = await queryLocations();
  const html = renderSSR(<MainPage locations={locations} />);
  return new Response(html, { headers: HTML_HEADERS });
}

serve(requestHandler);