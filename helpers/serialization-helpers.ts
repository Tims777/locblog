// deno-lint-ignore-file no-explicit-any ban-types
type Primitive = string | number | boolean | undefined | null | symbol | bigint;
type Serializable = { [Symbol.toPrimitive]: unknown };

type Simplify<T> = { [K in keyof T]: T[K] } & {};

type SerializedRecord<T> = Simplify<Serialized<T>>;

export type Serialized<T> = {
  [K in keyof T]: T[K] extends Primitive ? T[K]
    : T[K] extends Serializable ? string
    : T[K] extends Record<any, any> ? SerializedRecord<T[K]>
    : unknown;
};

export type MaybeSerialized<T> = T | Serialized<T>;
