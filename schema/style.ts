import { createSchema, text, type Type, array } from "./validators.ts";

export const StyleSchema = createSchema({
  name: text,
  classes: array.of(text),
  header: text.optional(),
  footer: text.optional(),
});

export type Style = Type<typeof StyleSchema>;
