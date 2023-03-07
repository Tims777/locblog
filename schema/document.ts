import { createSchema, text, Type } from "./validators.ts";

export const DocumentSchema = createSchema({
  content: text,
  path: text.optional(),
});

export type Document = Type<typeof DocumentSchema>;
