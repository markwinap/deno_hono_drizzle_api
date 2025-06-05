import { Hono } from "npm:hono";
import { describeRoute } from "npm:hono-openapi";
import {
  deleteUserSchema,
  getUserSchema,
  getUsersSchema,
  patchUserSchema,
  postUserSchema,
} from "../schemas/userSchema.ts";
import {
  bodyValidator,
  bodyValidatorOptional,
  paramValidator,
  queryValidator,
} from "../validators/userValidators.ts";
import { requestValidator } from "../utils/errorUtil.ts";
import {
  createUserHandler,
  deleteUserHandler,
  getUserHandler,
  getUsersHandler,
  updateUserHandler,
} from "../controllers/userController.ts";

const user = new Hono();

user.get(
  "/",
  describeRoute(getUsersSchema),
  requestValidator("query", queryValidator),
  getUsersHandler,
);
user.get(
  "/:id",
  describeRoute(getUserSchema),
  requestValidator("param", paramValidator),
  getUserHandler,
);
user.patch(
  "/:id",
  describeRoute(patchUserSchema),
  requestValidator("json", bodyValidatorOptional),
  updateUserHandler,
);
user.post(
  "/",
  describeRoute(postUserSchema),
  requestValidator("json", bodyValidator),
  createUserHandler,
);
user.delete(
  "/:id",
  describeRoute(deleteUserSchema),
  requestValidator("param", paramValidator),
  deleteUserHandler,
);

export { user };
