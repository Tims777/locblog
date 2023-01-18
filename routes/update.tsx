import { Handlers } from "$fresh/server.ts";
import db from "../data/database.ts";
import GeoLocationInput from "../islands/GeoLocationInput.tsx";
import { GeoLocationDto } from "../types.d.ts";

/*
export const handler: Handlers = {
  async POST(req, ctx) {
    const formData = await req.formData();
    const location: GeoLocationDto = {
      latitude: parseFloat(formData.get("latitude")!.toString()),
      longitude: parseFloat(formData.get("longitude")!.toString()),
      time: new Date(formData.get("time")!.toString()).toISOString() as unknown as Date,
    };
    db.location.insert(location);
    return ctx.render();
  },
};
*/

export default function UpdatePage() {
  return (
    <div>
      <form method="POST">
        <GeoLocationInput includeTime />
        <button type="submit">Update</button>
      </form>
    </div>
  );
}
