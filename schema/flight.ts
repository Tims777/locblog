import { PlaceSchema } from "./place.ts";
import { createSchema, date, type Type, uuid } from "./validators.ts";

export const FlightSchema = createSchema({
  id: uuid,
  from: PlaceSchema,
  to: PlaceSchema,
  date: date,
});

export type Flight = Type<typeof FlightSchema>;
