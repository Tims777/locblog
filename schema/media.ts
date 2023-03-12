import {
  _enum,
  createSchema,
  text,
  type Type,
  url,
  uuid,
} from "./validators.ts";

export enum MediaType {
  "image",
  "video",
  "audio",
}

export const MediaSchema = createSchema({
  id: uuid,
  type: _enum(MediaType),
  resource: url,
  preview: url.optional(),
  title: text.optional(),
  description: text.optional(),
  altText: text.optional(),
});

export type Media = Type<typeof MediaSchema>;
