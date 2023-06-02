import db, { Condition, Filter } from "../services/database.ts";
import type { Directive } from "preactify-markdown/types.d.ts";
import type { ConfiguratorContext } from "../types.d.ts";

const PAGE_SIZE = 10;

export default async function configure(
  directive: Directive,
  context?: ConfiguratorContext,
) {
  const attribs = directive.attributes ?? {};
  const where = getFilter(attribs);
  const orderBy = "published desc";
  const limit = PAGE_SIZE;
  const { total } = (await db.document.execute<{ total: bigint }>({
    what: ["count(*) as total"],
    where,
  }))[0];
  const pageCount = Math.ceil(Number(total) / PAGE_SIZE);
  const page = getPageNumber(context?.req.url ?? "", 1, pageCount);
  const offset = Math.max(page - 1, 0) * PAGE_SIZE;
  const documents = await db.document.query({ where, orderBy, limit, offset });
  return { documents, page, pageCount };
}

function getPageNumber(url: string, min: number, max: number) {
  const param = new URL(url).searchParams.get("page");
  const num = param ? parseInt(param) : min;
  if (num < min) return min;
  if (num > max) return max;
  return num;
}

function getFilter(attribs: Record<string, string | null | undefined>) {
  const filter = new Filter();
  filter.add(Condition.isNotNull("published"));
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
