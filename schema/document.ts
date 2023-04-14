import { createSchema, text, Type, uuid } from "./validators.ts";

export const DocumentSchema = createSchema({
  id: uuid,
  type: text,
  content: text,
  path: text.optional(),
});

export type Document = Type<typeof DocumentSchema>;
