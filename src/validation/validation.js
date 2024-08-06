import { ResponseError } from "../error/response-error.js";

const validate = (schema, request) => {
  console.log("VALIDATION IN");
  const result = schema.validate(request, {
    abortEarly: false,
    allowUnknown: false,
  });

  if (result.error) {
    console.log("ERRORR");
    throw new ResponseError(400, result.error.message);
  } else {
    return result.value;
  }
};

export { validate };
