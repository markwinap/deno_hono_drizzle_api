import {
  boolean,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

const timestampColumns = {
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .notNull().defaultNow(),
};

export const user = pgTable("User", {
  id: text().primaryKey().notNull(),
  email: text().notNull(),
  name: text(),
  ...timestampColumns,
});

export const post = pgTable("Post", {
  id: text().primaryKey().notNull(),
  title: text().notNull(),
  content: text(),
  published: boolean().default(false).notNull(),
  ...timestampColumns,
  userId: text().notNull().references(() => user.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
});
