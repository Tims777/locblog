import { Handlers } from "$fresh/server.ts";
import {
  createErrorResponse,
  createJsonResponse,
} from "../../../helpers/response-helpers.ts";
import db from "../../../services/database.ts";

export const handler: Handlers = {
  async GET(_, ctx) {
    const gallery = await db.gallery.query({
      where: { name: ctx.params.name },
      limit: 1,
    });

    if (gallery.length) {
      return createJsonResponse(gallery[0]);
    } else {
      return createErrorResponse(404);
    }
  },
};
