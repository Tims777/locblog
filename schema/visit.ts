import { createSchema, date, integer, Type } from "./validators.ts";

export const VisitSchema = createSchema({
  date: date,
  days: integer,
});

export type Visit = Type<typeof VisitSchema>;
