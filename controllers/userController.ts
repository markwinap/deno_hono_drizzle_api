import { Context } from "npm:hono";
import userService from "../services/userService.ts";
import {
  bodyValidator,
  bodyValidatorOptional,
  paramValidator,
  queryValidator,
} from "../validators/userValidators.ts";
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

const getUserHandler = async (c: Context) => {
  try {
    const id = c.req.param("id");
    const paramValidation = paramValidator({ id });
    if (paramValidation instanceof type.errors) {
      return c.json({
        success: false,
        data: null,
        message: "Validation error",
        errors: paramValidation.summary,
      }, 400);
    }

    const service = new userService();
    const user = await service.getUserById(id);

    if (!user) {
      return c.json({
        success: false,
        data: null,
        message: "User not found",
      }, 404);
    }

    return c.json({
      success: true,
      data: user,
      message: "User fetched successfully",
    });
  } catch (error) {
    return c.json({
      success: false,
      data: null,
      message: error instanceof Error
        ? error.message
        : "Failed to fetch user data",
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

const updateUserHandler = async (c: Context) => {
  try {
    const id = c.req.param("id");
    const body = bodyValidatorOptional(c.req.json());
    if (body instanceof type.errors) {
      return c.json({
        success: false,
        data: null,
        message: "Validation error",
        errors: body.summary,
      }, 400);
    }

    const service = new userService();
    const updatedUser = await service.updateUser(id, body);

    if (!updatedUser) {
      return c.json({
        success: false,
        data: null,
        message: "User not found",
      }, 404);
    }

    return c.json({
      success: true,
      data: updatedUser,
      message: "User updated successfully",
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return c.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : "Failed to update user",
    }, 500);
  }
};

const deleteUserHandler = async (c: Context) => {
  try {
    const id = c.req.param("id");
    const paramValidation = paramValidator({ id });
    if (paramValidation instanceof type.errors) {
      return c.json({
        success: false,
        data: null,
        message: "Validation error",
        errors: paramValidation.summary,
      }, 400);
    }

    const service = new userService();
    const deletedUser = await service.deleteUser(id);

    if (!deletedUser) {
      return c.json({
        success: false,
        data: null,
        message: "User not found",
      }, 404);
    }

    return c.json({
      success: true,
      data: deletedUser,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return c.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : "Failed to delete user",
    }, 500);
  }
};

export { createUserHandler, getUserHandler, getUsersHandler, updateUserHandler, deleteUserHandler };
