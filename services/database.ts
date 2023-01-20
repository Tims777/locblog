import { Pool } from "postgres";
import { GeoLocationDto } from "../types.d.ts";

class Table<T> {
  constructor(
    private database: Database,
    private name: string,
    private members: string[],
  ) {}

  public async query(limit: number, params?: { orderBy: string }) {
    const client = await this.database.pool.connect();
    let query = `select ${this.members.join(", ")} from ${this.name}`;
    if (params?.orderBy) query += ` order by ${params.orderBy}`;
    if (limit > 0) query += ` limit ${limit}`;
    const result = await client.queryObject<T>(query);
    client.release();
    return result.rows;
  }

  public async insert(element: Record<string, any>) {
    const client = await this.database.pool.connect();
    const keys = [], values = [];
    for (const key of this.members) {
      keys.push(`"${key}"`);
      values.push(`'${element[key]}'`);
    }
    const query = `insert into ${this.name} (${keys.join(", ")}) values (${
      values.join(", ")
    })`;
    console.log(query);
    await client.queryArray(query);
  }
}

class Database {
  pool: Pool;

  constructor() {
    const dbString = Deno.env.get("DATABASE");
    if (!dbString) console.error("DATABASE is not set.");
    this.pool = new Pool(dbString, 3);
  }

  location = new Table<GeoLocationDto>(this, "location", [
    "latitude",
    "longitude",
    "time",
  ]);
}

const db = new Database();
export default db;
