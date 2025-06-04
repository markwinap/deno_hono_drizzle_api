import { defineConfig } from 'drizzle-kit';

const DATABASE_URL = Deno.env.get("DATABASE_URL")!;

export default defineConfig({
  out: './drizzle',
  schema: './drizzle/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: DATABASE_URL,
  },
});