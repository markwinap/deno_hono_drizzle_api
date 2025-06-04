import { Hono } from "npm:hono";
import { compress } from 'npm:hono/compress';
import { logger } from 'npm:hono/logger';
import { describeRoute, openAPISpecs } from 'npm:hono-openapi';
import { arktypeValidator } from "npm:@hono/arktype-validator";
import { swaggerUI } from "@hono/swagger-ui";
import { type } from "npm:arktype";
import { user } from "./routes/userRoute.ts";
import { weather } from "./routes/weatherRoute.ts";

const querySchema = type({
  name: "string",
});

const responseSchema = type({
  message: "string",
});

const app = new Hono();
//app.use(compress())

app.route('/user', user);
app.route('/weather', weather);

app.get(
  "/",
  describeRoute({
    description: "Say hello to the user",
    responses: {
      200: {
        description: "Successful response",
        content: {
          // success response with list of users
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "Hello Hono!",
                },
              },
            },
          },
        },
      },
    },
  }),
  arktypeValidator("query", querySchema),
  (c) => {
    const query = c.req.valid("query");
    const result = {
      message: `Hello ${query?.name ?? "Hono"}!`,
    };
    // Validate the response object using the responseSchema.
    responseSchema.assert(result);
    return c.json(result, 200);
  },
);

app.get(
  "/openapi",
  openAPISpecs(app, {
    documentation: {
      info: {
        title: "Hono API",
        version: "1.0.0",
        description: "Greeting API",
      },
      servers: [
        { url: "http://localhost:3000", description: "Local Server" },
      ],
    },
  }),
);

app.get("/ui", swaggerUI({ url: "/openapi" }));

Deno.serve(app.fetch);
