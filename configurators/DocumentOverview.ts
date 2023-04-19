import db, { Condition, Filter } from "../services/database.ts";
import type { Directive } from "preactify-markdown/types.d.ts";
import type { ConfiguratorContext } from "../types.d.ts";

export default async function configure(
  directive: Directive,
  context?: ConfiguratorContext,
) {
  const attribs = directive.attributes ?? {};
  const where = getFilter(attribs);
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

function getFilter(attribs: Record<string, string | null | undefined>) {
  const filter = new Filter();
  if (attribs.type) filter.add(Condition.eq("type", attribs.type));
  if (attribs.category) {
    const categoryFilter = new Filter([], "or");
    categoryFilter.add(
      ...attribs.category.split(",").map((c) =>
        Condition.like("path", `${c}/%`)
      ),
    );
    filter.add(categoryFilter);
  }
  return filter;
}
