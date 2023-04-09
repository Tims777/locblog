import { createSchema, date, integer, type Type, uuid } from "./validators.ts";

export const VisitSchema = createSchema({
  id: uuid,
  date: date,
  days: integer.optional(),
});

export type Visit = Type<typeof VisitSchema>;
