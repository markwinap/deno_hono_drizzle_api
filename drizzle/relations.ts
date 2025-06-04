import { relations } from "drizzle-orm/relations";
import { user, post } from "./schema.ts";

export const postRelations = relations(post, ({one}) => ({
	user: one(user, {
		fields: [post.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	posts: many(post),
}));