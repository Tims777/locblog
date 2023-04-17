import { createSchema, text, uuid, type Type } from "./validators.ts";

export const AuthorSchema = createSchema({
  id: uuid,
  name: text,
});

export type Author = Type<typeof AuthorSchema>;
