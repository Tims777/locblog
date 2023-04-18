import { Pool } from "postgres";
import { DocumentSchema } from "../schema/document.ts";
import { FlightSchema } from "../schema/flight.ts";
import { GallerySchema } from "../schema/gallery.ts";
import { PlaceDetailsSchema } from "../schema/place.ts";
import { array } from "../schema/validators.ts";
import object from "https://denoporter.sirjosh.workers.dev/v1/deno.land/x/computed_types@v1.11.2/src/object.ts";

export interface QueryProps {
  where?: Filter | Record<string, string>;
  orderBy?: string;
  limit?: number;
  offset?: number;
}

export class Condition<T> {
  constructor(
    public field: string,
    public value: T,
    public operator: string = "=",
  ) {}

  public prepare(args: unknown[]) {
    const argIndex = args.push(this.value);
    return `${this.field} ${this.operator} $${argIndex}`;
  }

  public static eq<T>(field: string, value: T) {
    return new Condition(field, value, "=");
  }

  public static neq<T>(field: string, value: T) {
    return new Condition(field, value, "!=");
  }

  public static like<T>(field: string, value: T) {
    return new Condition(field, value, "like");
  }
}

export class Filter<T = unknown> {
  constructor(
    public conditions: (Filter<T> | Condition<T>)[] = [],
    public connector: "and" | "or" = "and",
  ) {}

  public prepare(args: unknown[]) {
    const result: string[] = [];
    for (const child of this.conditions) {
      result.push(child.prepare(args));
    }
    return `(${result.join(` ${this.connector} `)})`;
  }

  public add(...conditions: (Filter<T> | Condition<T>)[]) {
    for (const c of conditions) {
      this.conditions.push(c);
    }
  }
}

function prepare(filter: Filter | Record<string, string>, args: unknown[]) {
  if (filter instanceof Filter) {
    return filter.prepare(args);
  } else {
    return Object.entries(filter).map(
      ([k, v]) => Condition.eq(k, v).prepare(args),
    ).join(" ");
  }
}

class View<S> {
  constructor(
    private database: Database,
    private name: string,
    private schema: S,
  ) {}

  public async query(props?: QueryProps) {
    const client = await this.database.pool.connect();
    const args: unknown[] = [];
    let query = `select * from ${this.name}`;
    if (props?.where) query += ` where ${prepare(props?.where, args)}`;
    if (props?.orderBy) query += ` order by ${props.orderBy}`;
    if (props?.limit) query += ` limit ${props.limit}`;
    if (props?.offset) query += ` offset ${props.offset}`;
    const result = await client.queryObject(query, args);
    client.release();
    const validator = array.of(this.schema);
    return validator(result.rows);
  }
}

class Database {
  pool: Pool;

  constructor(
    dbString = Deno.env.get("DATABASE"),
  ) {
    if (!dbString) console.error("DATABASE is not set.");
    this.pool = new Pool(dbString, 3, true);
  }

  document = new View(this, "document_aggregate", DocumentSchema);
  gallery = new View(this, "gallery_aggregate", GallerySchema);
  place_overview = new View(this, "place_aggregate", PlaceDetailsSchema);
  flight_overview = new View(this, "flight_aggregate", FlightSchema);
}

const db = new Database();
export default db;
