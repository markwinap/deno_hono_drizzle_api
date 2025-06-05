import { desc, eq } from "drizzle-orm";
import db from "../drizzle/db.ts";
import { user } from "../drizzle/schema.ts";

export class UserService {
  /**
   * Create a new user in the database.
   * @param {Object} userData - The data of the user to be created.
   * @param {string} userData.name - The name of the user.
   * @param {string} userData.email - The email of the user.
   * @return {Promise<Object>} The created user object.
   * @throws {Error} If there is an error during user creation.
   * * @example
   * const userService = new UserService();
   * const newUser = await userService.createUser({
   *   name: "John Doe",
   *  email: "test@test.com"
   *  });
   * console.log(newUser);
   */
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

    return updatedUser;
  }

  /**
   * Retrieve a user by their ID.
   *
   * @param {string} id - The ID of the user.
   * @return {Promise<Object|null>} The user object if found, or null otherwise.
   * @throws {Error} If there is an error during the retrieval process.
   * @example
   * const userService = new UserService();
   * const user = await userService.getUserById("user-id");
   * console.log(user);
   */
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

  /**
   * Fetch all users with optional filtering by name or email.
   *
   * @param {Object} params - Parameters for filtering and pagination.
   * @param {string} [params.name] - Optional user's name filter.
   * @param {string} [params.email] - Optional user's email filter.
   * @param {number} params.limit - The maximum number of users to return.
   * @param {number} params.offset - The number of users to skip.
   * @return {Promise<Array<Object>>} An array of user objects.
   * @throws {Error} If there is an error during the retrieval process.
   * @example
   * const userService = new UserService();
   * const users = await userService.getAllUsers({
   * name: "John",
   * email: "test@.com",
   * limit: 10,
   * offset: 0
   * });
   * console.log(users);
   */
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

  /**
   * Update an existing user's details.
   *
   * @param {string} id - The ID of the user to update.
   * @param {Partial<{ name: string; email: string }>} userData - Fields to update.
   * @return {Promise<Object>} The updated user object.
   * @throws {Error} If there is an error during the update process.
   * @example
   * const userService = new UserService();
   * const updatedUser = await userService.updateUser("user-id", {
   * name: "Jane Doe",
   * email: "test@test.com"
   * });
   */
  async updateUser(
    id: string,
    userData: Partial<{ name: string; email: string }>,
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

  /**
   * Delete a user from the database.
   *
   * @param {string} id - The ID of the user to delete.
   * @return {Promise<Object|null>} The deleted user's ID wrapped in an object or null if no user was deleted.
   * @throws {Error} If there is an error during the deletion process.
   * @example
   * const userService = new UserService();
   * const deletedUser = await userService.deleteUser("user-id");
   * console.log(deletedUser);
   */
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
