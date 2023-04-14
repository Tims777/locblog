import { type Directive } from "preactify-markdown/types.d.ts";
import db from "../services/database.ts";

export default async function configure(directive: Directive) {
  const attribs = directive.attributes ?? {};
  const where = attribs.type ? { type: attribs.type } : undefined;
  const query = db.document.query({ where });
  return { documents: await query };
}
