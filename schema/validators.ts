import { unknown } from "computed-types";
export { array, Schema as createSchema, type Type } from "computed-types";
export const text = unknown.string();
export const uuid = text.regexp(/^[0-9a-f]{8}(-?[0-9a-f]{4}){3}-?[0-9a-f]{12}/);
export const latitude = unknown.number().gte(-90).lte(90);
export const longitude = unknown.number().gte(-180).lte(180);
export const integer = unknown.number().integer();
export const date = unknown.date();
