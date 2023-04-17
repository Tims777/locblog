import { createSchema, date, text, Type, url, uuid } from "./validators.ts";

export const DocumentSchema = createSchema({
  id: uuid,
  type: text,
  title: text,
  content: text,
  thumbnail: url.optional(),
  published: date.optional(),
  path: text.optional(),
});

export type Document = Type<typeof DocumentSchema>;
