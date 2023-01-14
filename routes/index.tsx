import { Head } from "$fresh/runtime.ts";
import Globe from "../islands/Globe.tsx";
import Pin from "../components/Pin.tsx";
import { GeoLocation, GeoObject } from "../types.ts";
import { GeoRotation } from "../types.ts";
import * as world from "../static/world.json" assert { type: "json" };

const location: GeoLocation = [175.8, -37.4];
const rotation: GeoRotation = [180, 0];

export default function Home() {
  return (
    <>
      <Head>
        <title>LocBlog</title>
      </Head>
      <div>
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width={1000} height={500}>
          <Globe rotation={rotation} features={world.default.features as GeoObject[]} />
          <Pin rotation={rotation} location={location} />
        </svg>
      </div>
    </>
  );
}
