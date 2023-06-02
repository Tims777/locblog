import type { Directive } from "preactify-markdown/types.d.ts";
import type { ConfiguratorContext } from "../types.d.ts";
import db from "../services/database.ts";
import Comment from "../components/Comment.tsx";

export default async function configure(
  _directive: Directive,
  context?: ConfiguratorContext,
) {
  const docId = context?.doc?.id;
  if (!docId) return null;

  const comments = await db.comment.query({ where: { document: docId } });

  return {
    children: comments.map((c) => Comment(c)),
  };
}
