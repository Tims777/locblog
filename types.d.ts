import type { GeoPermissibleObjects } from "d3";
import type { HandlerContext } from "$fresh/server.ts";
import type { Document } from "./schema/document.ts";
export type Pair<T> = [T, T];
export type Triplet<T> = [T, T, T];
export type Quartet<T> = [T, T, T, T];
export type GeoObject = GeoPermissibleObjects & {
  properties?: Record<string, unknown>;
};
export type uuid = string;
export type Vec2 = Pair<number>;
export type Vec3 = Triplet<number>;
export type Vec4 = Quartet<number>;
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
  doc?: Document;
}
