import { FreshContext } from "$fresh/server.ts";
import redirect from "../services/redirect.ts";

export async function handler(req: Request, ctx: FreshContext) {
  const target = redirect.for(req.url);
  if (target) return target;
  const response = await ctx.next();
  return response;
}
