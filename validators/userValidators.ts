import { type } from "npm:arktype";

const Email = type("string.email");

const queryValidator = type({
  name: type.string.optional(),
  email: Email.optional(),
  limit: type("string.integer.parse").default("10"),
  offset: type("string.integer.parse").default("0"),
});

const paramValidator = type({ id: type.string });

const bodyValidator = type({
  name: type.string,
  email: Email,
});

export { bodyValidator, paramValidator, queryValidator };
