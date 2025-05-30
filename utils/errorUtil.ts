import { arktypeValidator } from "npm:@hono/arktype-validator";
const requestValidator = (
  dataType: "json" | "query" | "param",
  validator: any,
) => {
  return arktypeValidator(dataType, validator, (result, c) => {
    if (!result.success) {
      return c.json({
        code: "validation_error",
        message: "The request validation failed",
        errors: result.errors,
      }, 400);
    }
  });
};
export { requestValidator };
