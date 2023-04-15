import { createSchema, date, text, Type, uuid } from "./validators.ts";

export const DocumentSchema = createSchema({
  id: uuid,
  type: text,
  title: text,
  content: text,
  published: date.optional(),
  path: text.optional(),
});

export type Document = Type<typeof DocumentSchema>;
