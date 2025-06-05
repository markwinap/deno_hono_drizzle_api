import { Hono } from 'npm:hono';
import { describeRoute } from 'npm:hono-openapi';
import { getUsersSchema, getUserSchema, postUserSchema } from '../schemas/userSchema.ts';
import { bodyValidator, paramValidator, queryValidator, bodyValidatorOptional } from "../validators/userValidators.ts";
import { requestValidator } from "../utils/errorUtil.ts";
import { createUserHandler, getUserHandler, getUsersHandler, updateUserHandler, deleteUserHandler } from "../controllers/userController.ts";

const user = new Hono();

user.get(
  '/',
  describeRoute(getUsersSchema),
  requestValidator('query', queryValidator),
  getUsersHandler,
);
user.get('/:id',
  describeRoute(getUserSchema),
  requestValidator('param', paramValidator),
  getUserHandler,
);
user.patch('/:id',
  describeRoute(postUserSchema),
  requestValidator('json', bodyValidator),
  createUserHandler,
);
user.post('/',
  describeRoute(postUserSchema),
  requestValidator('json', bodyValidator),
  createUserHandler,
);
user.delete('/:id',
  describeRoute(getUserSchema),
  requestValidator('param', paramValidator),
  deleteUserHandler,
);

export { user };