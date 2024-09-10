import Joi from "joi";

const postValidation = Joi.object({
  text: Joi.string().max(300).optional(),
  img: Joi.optional(),
}).or("text", "img");

const commentValidation = Joi.string()
  .max(300)
  .message("text are required!")
  .required();

export { postValidation, commentValidation };
