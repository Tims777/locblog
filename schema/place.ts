import { VisitSchema } from "./visit.ts";
import {
  array,
  createSchema,
  date,
  latitude,
  longitude,
  text,
  type Type,
  url,
  uuid,
} from "./validators.ts";

const PlaceFundamentals = {
  id: uuid,
  name: text,
  latitude: latitude,
  longitude: longitude,
};

export const PlaceSchema = createSchema(PlaceFundamentals);

export type Place = Type<typeof PlaceSchema>;

export const PlaceDetailsSchema = createSchema({
  ...PlaceFundamentals,
  visits: array.of(VisitSchema),
  resource: url.optional(),
  parent: uuid.optional(),
  last_visit: date.optional(),
});

export type PlaceDetails = Type<typeof PlaceDetailsSchema>;
