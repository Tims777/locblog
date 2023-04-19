import { createSchema, text, type Type, uuid } from "./validators.ts";

export const AuthorSchema = createSchema({
  id: uuid,
  name: text,
});

export type Author = Type<typeof AuthorSchema>;
