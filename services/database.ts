import { Pool } from "postgres";
import { DocumentSchema } from "../schema/document.ts";
import { GallerySchema } from "../schema/gallery.ts";
import { MediaSchema } from "../schema/media.ts";
import { PlaceDetailsSchema } from "../schema/place.ts";
import { array } from "../schema/validators.ts";

interface QueryProps {
  where?: Record<string, string>;
  orderBy?: string;
  limit?: number;
}

class View<S> {
  constructor(
    private database: Database,
    private name: string,
    private schema: S,
  ) {}

  public async query(props?: QueryProps) {
    const client = await this.database.pool.connect();
    let query = `select * from ${this.name}`;
    let where = "where";
    for (const field in props?.where) {
      query += ` ${where} ${field} = $${field}`;
      where = "and";
    }
    if (props?.orderBy) query += ` order by ${props.orderBy}`;
    if (props?.limit) query += ` limit ${props.limit}`;
    const result = await client.queryObject(query, props?.where);
    client.release();
    const validator = array.of(this.schema);
    return validator(result.rows);
  }
}

class Table {
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
    const query = `insert into ${this.name} (${keys.join(", ")}) values (${
      values.join(",")
    })`;
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
  document = new View(this, "document", DocumentSchema);
  gallery = new View(this, "gallery", GallerySchema);
  place_overview = new View(this, "place_overview", PlaceDetailsSchema);
}

const db = new Database();
export default db;
