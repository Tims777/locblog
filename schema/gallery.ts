import { MediaSchema } from "./media.ts";
import { array, createSchema, text, type Type, uuid } from "./validators.ts";

export const GallerySchema = createSchema({
  id: uuid,
  content: array.of(MediaSchema),
  name: text.optional(),
});

export type Gallery = Type<typeof GallerySchema>;
