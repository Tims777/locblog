import { type Directive } from "preactify-markdown/types.d.ts";
import db from "../services/database.ts";

export default async function configure(directive: Directive) {
  const attribs = directive.attributes ?? {};
  const where = attribs.type ? { type: attribs.type } : undefined;
  const orderBy = "published desc";
  const query = db.document.query({ where, orderBy });
  return { documents: await query };
}
