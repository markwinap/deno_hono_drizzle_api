import { type } from "npm:arktype";

const Email = type({ email: "string.email" });

const queryValidator = type({
  name: type.string.optional(),
  email: Email.optional(),
  limit: type.number.optional(),
});

const paramValidator = type({ id: type.string });

const bodyValidator = type({
  name: type.string,
  email: Email,
  password: type.string,
});

export { paramValidator, queryValidator, bodyValidator };
