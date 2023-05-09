import { AuthorSchema } from "./author.ts";
import { MediaSchema } from "./media.ts";
import { StyleSchema } from "./style.ts";
import { createSchema, date, text, Type, uuid } from "./validators.ts";

export const DocumentSchema = createSchema({
  id: uuid,
  type: text,
  title: text,
  content: text,
  summary: text.optional(),
  thumbnail: MediaSchema.optional(),
  published: date.optional(),
  author: AuthorSchema.optional(),
  style: StyleSchema.optional(),
  path: text.optional(),
});

export type Document = Type<typeof DocumentSchema>;
