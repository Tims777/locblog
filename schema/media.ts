import {
  _enum,
  createSchema,
  text,
  type Type,
  url,
  uuid,
} from "./validators.ts";

export enum MediaType {
  "image" = "image",
  "video" = "video",
  "audio" = "audio",
}

export const MediaSchema = createSchema({
  id: uuid,
  type: _enum(MediaType),
  resource: url,
  preview: url.optional(),
  title: text.optional(),
  description: text.optional(),
  alt: text.optional(),
});

export type Media = Type<typeof MediaSchema>;
