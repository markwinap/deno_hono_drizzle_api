import { type } from "npm:arktype";

const queryValidator = type({
  name: type.string,
});

export { queryValidator };
