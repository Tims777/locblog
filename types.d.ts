import type { GeoPermissibleObjects } from "d3";
export type Pair<T> = [T, T];
export type GeoObject = GeoPermissibleObjects & {
  properties?: Record<string, unknown>;
};
export type Rotation = Pair<number>;
export type Translation = Pair<number>;
export type GeoLocation = Pair<number>;
export interface GeoLocationDto {
  latitude: number;
  longitude: number;
  time?: Date;
  label?: string;
  resource?: string;
}
export type ValueFunction<TArgs, TResult> = (args: TArgs) => TResult;
export type Template = ValueFunction<Record<string, string>, string>;
export interface Locality {
  latitude: number;
  longitude: number;
  label?: string;
  description?: string;
}
