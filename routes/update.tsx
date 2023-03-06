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
    const id = crypto.randomUUID();
    console.log(id);
    const place: Record<string, unknown> = {
      id: id,
      latitude: parseFloat(formData.get("latitude")!.toString()),
      longitude: parseFloat(formData.get("longitude")!.toString()),
      name: formData.get("label")?.toString(),
    };
    await db.place.insert(place);
    const visit: Record<string, unknown> = {
      place: id,
      date: new Date(formData.get("time")!.toString()).toISOString(),
    }
    await db.visit.insert(visit);
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
        <GeoLocationInput includeTime />
        <button type="submit">Update</button>
      </form>
    </div>
  );
}
