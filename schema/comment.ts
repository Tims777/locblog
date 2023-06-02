import { createSchema, date, text, Type, uuid } from "./validators.ts";

export const CommentSchema = createSchema({
  id: uuid,
  content: text,
  author: text,
  published: date.optional(),
});

export type Comment = Type<typeof CommentSchema>;
