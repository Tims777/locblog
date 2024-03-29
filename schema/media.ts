import {
  _enum,
  createSchema,
  integer,
  text,
  type Type,
  url,
  uuid,
} from "./validators.ts";

export enum MediaType {
  image = "image",
  video = "video",
  audio = "audio",
}

export const MediaSchema = createSchema({
  id: uuid,
  type: _enum(MediaType),
  resource: url,
  preview: url.optional(),
  title: text.optional(),
  description: text.optional(),
  alt: text.optional(),
  width: integer.optional(),
  height: integer.optional(),
});

export type Media = Type<typeof MediaSchema>;
