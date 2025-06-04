import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema.ts";
import * as relations from "./relations.ts";
import { Client } from "pg";

const DATABASE_URL = Deno.env.get("DATABASE_URL")!;

const client = new Client(DATABASE_URL);
// Connect the client
await client.connect();

export const db = drizzle(client, { schema: { ...schema, ...relations } });
export default db;
