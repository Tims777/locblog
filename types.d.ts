import type { GeoPermissibleObjects } from "d3";
import type { HandlerContext } from "$fresh/server.ts";
export type Pair<T> = [T, T];
export type GeoObject = GeoPermissibleObjects & {
  properties?: Record<string, unknown>;
};
export type uuid = string;
export type Rotation = Pair<number>;
export type Translation = Pair<number>;
export type GeoLocation = Pair<number>;
export type ValueFunction<TArgs, TResult> = (args: TArgs) => TResult;
export type Template = ValueFunction<Record<string, string>, string>;
export interface Locality {
  latitude: number;
  longitude: number;
  label?: string;
  description?: string;
}

interface ConfiguratorContext {
  req: Request;
  // deno-lint-ignore no-explicit-any
  ctx: HandlerContext<any>;
}
