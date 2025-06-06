import { Hono } from 'npm:hono';
import { describeRoute } from 'npm:hono-openapi';
import { getWeatherSchema } from '../schemas/weatherSchema.ts';
import { queryValidator } from "../validators/weatherValidators.ts";
import { requestValidator } from "../utils/errorUtil.ts";
import { getWeatherHandler } from '../controllers/weatherController.ts';

const weather = new Hono();

weather.get(
  '/',
  describeRoute(getWeatherSchema),
  requestValidator('query', queryValidator),
  getWeatherHandler,
);

export { weather };
