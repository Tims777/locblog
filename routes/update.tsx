import { Handlers } from "$fresh/server.ts";
import db from "../services/database.ts";
import GeoLocationInput from "../islands/GeoLocationInput.tsx";
import auth from "../services/authentication.ts";

export const handler: Handlers = {
  async GET(req, ctx) {
    if (!auth.validateHTTPAuthorization(req)) {
      return auth.response.unauthorized;
    }
    return ctx.render();
  },
  async POST(req, ctx) {
    if (!auth.validateHTTPAuthorization(req)) {
      return auth.response.unauthorized;
    }
    const formData = await req.formData();
    const location: Record<string, number | string> = {
      latitude: parseFloat(formData.get("latitude")!.toString()),
      longitude: parseFloat(formData.get("longitude")!.toString()),
      time: new Date(formData.get("time")!.toString()).toISOString(),
    };
    db.location.insert(location);
    return ctx.render();
  },
};

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
