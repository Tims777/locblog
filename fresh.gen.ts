// DO NOT EDIT. This file is generated by fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import config from "./deno.json" assert { type: "json" };
import * as $0 from "./routes/_404.tsx";
import * as $1 from "./routes/index.tsx";
import * as $2 from "./routes/map.tsx";
import * as $3 from "./routes/post/[...locator].tsx";
import * as $4 from "./routes/update.tsx";
import * as $$0 from "./islands/GeoLocationInput.tsx";
import * as $$1 from "./islands/Globe.tsx";
import * as $$2 from "./islands/InteractiveMap.tsx";
import * as $$3 from "./islands/PlaceDetails.tsx";

const manifest = {
  routes: {
    "./routes/_404.tsx": $0,
    "./routes/index.tsx": $1,
    "./routes/map.tsx": $2,
    "./routes/post/[...locator].tsx": $3,
    "./routes/update.tsx": $4,
  },
  islands: {
    "./islands/GeoLocationInput.tsx": $$0,
    "./islands/Globe.tsx": $$1,
    "./islands/InteractiveMap.tsx": $$2,
    "./islands/PlaceDetails.tsx": $$3,
  },
  baseUrl: import.meta.url,
  config,
};

export default manifest;
