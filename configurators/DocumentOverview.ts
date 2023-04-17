import db from "../services/database.ts";
import type { Directive } from "preactify-markdown/types.d.ts";
import type { ConfiguratorContext } from "../types.d.ts";

export default async function configure(
  directive: Directive,
  context?: ConfiguratorContext,
) {
  const attribs = directive.attributes ?? {};
  const where = attribs.type ? { type: attribs.type } : undefined;
  const orderBy = "published desc";
  const limit = 10;
  const page = getPageNumber(context?.req.url ?? "");
  const offset = page * limit;
  const query = db.document.query({ where, orderBy, limit, offset });
  return { documents: await query, page };
}

function getPageNumber(url: string) {
  const param = new URL(url).searchParams.get("page");
  const num = param ? parseInt(param) : 0;
  return num >= 0 ? num : 0;
}
