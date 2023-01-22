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
  time: Date;
}
