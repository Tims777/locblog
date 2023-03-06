import { Pool } from "postgres";
import { PlaceSchema } from "../schema/place.ts";
import { array } from "../schema/validators.ts";

class View<S> {
  constructor(
    private database: Database,
    private name: string,
    private schema: S,
  ) {}

  public async query(params?: { orderBy?: string; limit?: number }) {
    const client = await this.database.pool.connect();
    let query = `select * from ${this.name}`;
    if (params?.orderBy) query += ` order by ${params.orderBy}`;
    if (params?.limit) query += ` limit ${params.limit}`;
    const result = await client.queryObject(query);
    client.release();
    const validator = array.of(this.schema);
    return validator(result.rows);
  }
}

class Table<S> {
  constructor(
    private database: Database,
    private name: string,
  ) {}

  public async insert(element: Record<string, unknown>) {
    const client = await this.database.pool.connect();
    const keys = [], values = [];
    for (const key in element) {
      keys.push(`"${key}"`);
      values.push(`'${element[key]}'`);
    }
    const query = `insert into ${this.name} (${
      keys.join(", ")
    }) values (${values.join(",")})`;
    await client.queryArray(query);
  }
}

class Database {
  pool: Pool;

  constructor() {
    const dbString = Deno.env.get("DATABASE");
    if (!dbString) console.error("DATABASE is not set.");
    this.pool = new Pool(dbString, 3, true);
  }

  visit = new Table(this, "visit");
  place = new Table(this, "place");
  place_overview = new View(this, "place_overview", PlaceSchema);
}

const db = new Database();
export default db;
