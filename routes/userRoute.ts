import { Hono } from 'npm:hono';
import { describeRoute } from 'npm:hono-openapi';
import { getUsersSchema, getUserSchema, postUserSchema } from '../schemas/userSchema.ts';
import { queryValidator, paramValidator, bodyValidator } from "../validators/userValidators.ts";
import { requestValidator } from "../utils/errorUtil.ts";

const user = new Hono();

user.get(
  '/',
  describeRoute(getUsersSchema),
  requestValidator('query', queryValidator),
  (c) => c.text('List Users'),
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
  (c) => c.text('Create User'));

export { user };
