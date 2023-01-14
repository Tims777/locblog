export type { GeoPermissibleObjects as GeoObject } from "d3";
export type GeoLocation = [number, number];
export type GeoRotation = [number, number] | [number, number, number];

interface LocationDto {
    latitude: number,
    longitude: number,
    comment?: string,
}