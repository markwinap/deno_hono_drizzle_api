import { Context } from "npm:hono";
import userService from "../services/userService.ts";
import { bodyValidator, queryValidator } from "../validators/userValidators.ts";
import { type } from "arktype";

const getUsersHandler = async (c: Context) => {
  try {
    const params = queryValidator(c.req.query());
    if (params instanceof type.errors) {
      return c.json({
        success: false,
        data: null,
        message: "Validation error",
        errors: params.summary,
      }, 400);
    }
    const { name, email, limit, offset } = params;

    const servive = new userService();
    const users = await servive.getAllUsers({
      name,
      email,
      limit,
      offset,
    });

    return c.json({
      success: true,
      data: users,
      message: "Users fetched successfully",
    });
  } catch (error) {
    return c.json({
      success: false,
      data: null,
      message: error instanceof Error
        ? error.message
        : "Failed to fetch users data",
    }, 500);
  }
};

const createUserHandler = async (c: Context) => {
  try {
    const data = bodyValidator(c.req.json());
    if (data instanceof type.errors) {
      return c.json({
        success: false,
        data: null,
        message: "Validation error",
        errors: data.summary,
      }, 400);
    }

    const service = new userService();
    const newUser = await service.createUser(data);

    return c.json({
      success: true,
      data: newUser,
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return c.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : "Failed to create user",
    }, 500);
  }
};

export { createUserHandler, getUsersHandler };
