import { VisitSchema } from "./visit.ts";
import {
  array,
  createSchema,
  date,
  latitude,
  longitude,
  text,
  type Type,
  uuid,
} from "./validators.ts";

export const PlaceSchema = createSchema({
  id: uuid,
  name: text,
  latitude: latitude,
  longitude: longitude,
  visits: array.of(VisitSchema),
  parent: uuid.optional(),
  last_visit: date,
});

export type Place = Type<typeof PlaceSchema>;
