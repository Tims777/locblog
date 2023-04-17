import { AuthorSchema } from "./author.ts";
import { MediaSchema } from "./media.ts";
import { createSchema, date, text, Type, uuid } from "./validators.ts";

export const DocumentSchema = createSchema({
  id: uuid,
  type: text,
  title: text,
  content: text,
  thumbnail: MediaSchema.optional(),
  published: date.optional(),
  author: AuthorSchema.optional(),
  path: text.optional(),
});

export type Document = Type<typeof DocumentSchema>;
