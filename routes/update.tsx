import { Handlers } from "$fresh/server.ts";
import db from "../services/database.ts";
import GeoLocationInput from "../islands/GeoLocationInput.tsx";
import auth from "../services/authentication.ts";

export const handler: Handlers = {
  GET(req, ctx) {
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
    const location: Record<string, unknown> = {
      latitude: parseFloat(formData.get("latitude")!.toString()),
      longitude: parseFloat(formData.get("longitude")!.toString()),
      time: new Date(formData.get("time")!.toString()).toISOString(),
      description: formData.get("description")?.toString(),
    };
    await db.location.insert(location);
    return new Response(null, {
      status: 303,
      headers: { Location: "/map" },
    });
  },
};

export default function UpdatePage() {
  return (
    <div>
      <form method="POST">
        <GeoLocationInput includeTime includeName />
        <button type="submit">Update</button>
      </form>
    </div>
  );
}
