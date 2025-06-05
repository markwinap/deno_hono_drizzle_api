import { arktypeValidator } from "npm:@hono/arktype-validator";

/**
 * Utility function to validate request data using arktype-validator.
 * It checks the request data against the provided validator and returns a JSON response
 * with validation errors if the validation fails.
 * @param dataType - The type of data to validate (json, query, or param).
 * @param validator - The arktype validator to use for validation.
 * @returns A middleware function that validates the request data.
 */
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
