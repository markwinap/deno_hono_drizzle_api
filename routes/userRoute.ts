import { Hono } from 'npm:hono';
import { describeRoute } from 'npm:hono-openapi';
import { getUsersSchema, getUserSchema, postUserSchema } from '../schemas/userSchema.ts';
import { queryValidator, paramValidator, bodyValidator } from "../validators/userValidators.ts";
import { requestValidator } from "../utils/errorUtil.ts";
// UseerController.ts
import { createUserHandler, getUsersHandler } from "../controllers/userController.ts";

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
  (c) => {
  const id = c.req.param('id');
  return c.text('Get User: ' + id);
});
user.post('/',
  describeRoute(postUserSchema),
  requestValidator('json', bodyValidator),
  createUserHandler,
);

export { user };