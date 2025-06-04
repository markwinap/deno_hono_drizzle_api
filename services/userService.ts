import { desc, eq } from "drizzle-orm";
import db from "../drizzle/db.ts";
import { user } from "../drizzle/schema.ts";

export class UserService {
  async createUser(userData: { name: string; email: string }) {
    const { name, email } = userData;
    //timestamp
    const updatedAt = new Date();

    const newUser: typeof user.$inferInsert = {
      id: crypto.randomUUID(),
      name,
      email,
      updatedAt: updatedAt,
    };

    const [updatedUser] = await db.insert(user)
      .values([newUser])
      .returning({
        id: user.id,
        name: user.name,
        email: user.email,
        updatedAt: user.updatedAt,
        createdAt: user.createdAt,
      });
    // .values(newUser)
    // .returning({
    //   id: user.id,
    //   name: user.name,
    //   // email: user.email,
    //   // updatedAt: user.updatedAt,
    //   // createdAt: user.createdAt,
    // });

    return updatedUser;
  }

  async getUserById(id: string) {
    const foundUser = await db.query.user.findFirst({
      where: eq(user.id, id),
      columns: {
        id: true,
        name: true,
        email: true,
        updatedAt: true,
        createdAt: true,
      },
    });

    return foundUser;
  }

  async getAllUsers(params: {
    name?: string;
    email?: string;
    limit: number;
    offset: number;
  }) {
    console.log("Fetching all users with params:", params);
    const { name, email, limit, offset } = params;
    const query = db.select()
      .from(user)
      .orderBy(desc(user.createdAt));

    if (name) {
      query.where(eq(user.name, name));
    }
    if (email) {
      query.where(eq(user.email, email));
    }

    query.limit(limit).offset(offset);

    const users = await query;
    return users;
  }

  async updateUser(
    id: string,
    userData: Partial<{ name: string; email: string; password: string }>,
  ) {
    const updatedAt = new Date();

    const [updatedUser] = await db.update(user)
      .set({
        ...userData,
        updatedAt,
      })
      .where(eq(user.id, id))
      .returning({
        id: user.id,
        name: user.name,
        email: user.email,
        updatedAt: user.updatedAt,
        createdAt: user.createdAt,
      })
      .execute();

    return updatedUser;
  }

  async deleteUser(id: string) {
    const result = await db.delete(user)
      .where(eq(user.id, id))
      .returning({
        id: user.id,
      })
      .execute();
    return result.length > 0 ? result[0] : null;
  }
}
export default UserService;
