import { Hono } from "npm:hono";
import { compress } from 'npm:hono/compress';
import { logger } from 'npm:hono/logger';
import { openAPISpecs } from 'npm:hono-openapi';
import { swaggerUI } from "@hono/swagger-ui";
import { user } from "./routes/userRoute.ts";
import { weather } from "./routes/weatherRoute.ts";

const app = new Hono();
app.use(logger())
app.use(compress())

app.route('/user', user);
app.route('/weather', weather);

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
        { url: "http://localhost:8000", description: "Local Server" },
      ],
    },
  }),
);

app.get("/ui", swaggerUI({ url: "/openapi" }));

Deno.serve(app.fetch);
